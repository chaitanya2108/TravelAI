"use client";
import { useState, FormEvent } from "react";
import styles from "./page.module.css";
import { TripForm } from "../components/TripForm";
import { ItineraryDisplay } from "../components/ItineraryDisplay";
import { Navigation } from "../components/Navigation";
import { Recommendations } from "../components/Recommendations";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<{
    response: {
      destination: string;
      start_date: string;
      end_date: string;
      budget: number;
      activities: string[];
      preferences: string;
      itinerary: Record<string, any[]>;
    };
  } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const activities = Array.from(formData.getAll("activities"));

    // Get and validate dates
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;

    if (!startDate || !endDate) {
      console.error("Please select both start and end dates");
      setLoading(false);
      return;
    }

    const data = {
      destination: formData.get("destination"),
      start_date: startDate,
      end_date: endDate,
      budget: formData.get("budget"),
      activities: activities,
    };

    // Display input data
    console.log("Sending to backend:", {
      ...data,
      activities: activities.length ? activities : "No activities selected",
    });

    try {
      const response = await fetch("http://localhost:8000/api/process-input/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Network response was not ok");
      }

      const responseData = await response.json();
      setItinerary(responseData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Navigation />
      <main className={styles.main}>
        <TripForm onSubmit={handleSubmit} loading={loading} />
        {itinerary ? (
          <ItineraryDisplay itinerary={itinerary} />
        ) : (
          <Recommendations />
        )}
      </main>

      <footer className={styles.footer}>
        <p>© 2024 Travel AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
