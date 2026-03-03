import React, { useState } from 'react';
import axios from 'axios';

const WorkoutGenerator = ({ userId }) => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [workout, setWorkout] = useState(null);
    const [error, setError] = useState('');

    const generateWorkout = async () => {
        if (!prompt) return;
        setLoading(true);
        setError('');

        try {
            // Ton backend url défini dans ton fichier .env ou variables dokploy
            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/health/generate-workout`,
                { prompt_user: prompt },
                { headers: { 'x-user-id': userId } } // Important : ton middleware backend demande ça
            );

            setWorkout(response.data);
        } catch (err) {
            setError("Erreur lors de la génération de la séance.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4 text-slate-800">Générer une séance sur mesure (IA)</h2>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: Séance push orientée pecs, 45 min max, avec haltères uniquement"
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    onClick={generateWorkout}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-400"
                >
                    {loading ? 'Génération...' : 'Générer'}
                </button>
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {workout && workout.exercices && (
                <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-bold text-blue-800">{workout.titre}</h3>
                    <p className="text-sm text-gray-600 mb-4">⏱️ Durée estimée : {workout.duree_estimee}</p>

                    <h4 className="font-semibold mt-2">🔥 Échauffement :</h4>
                    <ul className="list-disc pl-5 mb-4 text-sm text-gray-700">
                        {workout.echauffement.map((ech, idx) => <li key={idx}>{ech}</li>)}
                    </ul>

                    <h4 className="font-semibold mb-2">💪 Exercices :</h4>
                    <div className="space-y-3">
                        {workout.exercices.map((exo, idx) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-200">
                                <div className="font-bold text-slate-800">{exo.nom}</div>
                                <div className="text-sm flex gap-4 text-gray-600 mt-1">
                                    <span>Séries: <strong>{exo.series}</strong></span>
                                    <span>Reps: <strong>{exo.reps}</strong></span>
                                    <span>Repos: <strong>{exo.repos}</strong></span>
                                </div>
                                {exo.consigne && <div className="text-xs italic mt-2 text-gray-500">💡 {exo.consigne}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkoutGenerator;
