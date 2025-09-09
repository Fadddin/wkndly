"use client";
import { useEffect, useState } from "react";
import { activities } from "../../lib/weekend-data"; // adjust path

export default function SavedPlansPage() {
    const [savedPlans, setSavedPlans] = useState<any[]>([]);

    function reconstructSavedPlans(plans: any[]) {
        return plans.map((plan) => ({
            ...plan,
            scheduledActivities: plan.scheduledActivities.map((sa: any) => {
                const fullActivity = activities.find((a) => a.id === sa.activity.id);
                return {
                    ...sa,
                    activity: fullActivity || sa.activity, // fallback if not found
                };
            }),
        }));
    }
    

    useEffect(() => {
        try {
            const storedPlans = localStorage.getItem("weekendly-saved-plans");
            console.log("Raw storedPlans:", storedPlans);

            if (storedPlans) {
                const parsed = JSON.parse(storedPlans);
                console.log("Parsed savedPlans:", parsed);

                // reconstruct activities
                const reconstructed = reconstructSavedPlans(parsed);
                setSavedPlans(reconstructed);
            } else {
                console.log("No savedPlans found in localStorage");
            }
        } catch (err) {
            console.error("Error parsing savedPlans:", err);
        }
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Saved Plans</h1>

            {savedPlans.length > 0 ? (
                <ul className="space-y-4">
                    {savedPlans.map((plan, index) => (
                        <li
                            key={index}
                            className="p-4 bg-white rounded-xl shadow-md border border-gray-200"
                        >
                            <h2 className="text-lg font-semibold">{plan.name}</h2>
                            <p className="text-gray-600">{plan.date}</p>

                            <div className="mt-2">
                                <h3 className="font-semibold">Activities:</h3>
                                <ul className="list-disc list-inside text-gray-700">
                                    {plan.scheduledActivities.map((sa, i) => (
                                        <li key={i}>
                                            {sa.activity?.name || "Unknown"} — {sa.day} @ {sa.timeSlot}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No saved plans yet.</p>
            )}
        </div>
    );
}
