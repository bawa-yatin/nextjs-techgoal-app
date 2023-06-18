import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { supabase } from "../utils/supabase";
import WorkoutCard from "../components/WorkoutCard";

export default function Home({ session }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    const user = supabase.auth.user();
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", user?.id);

      if (error) throw error;
      setData(data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const handleDelete = async id => {
    try {
      const user = supabase.auth.user();
      const { data, error } = await supabase
        .from("workouts")
        .delete()
        .eq("id", id)
        .eq("user_id", user?.id);
      fetchWorkouts();
      if (error) throw error;
      alert("Workout deleted successfully");
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>FITDOC</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.home}>
        {!session?.user ? (
          <div style={{ marginTop: "250px" }}>
            <p>
              Welcome to FITDOC. Please Login to your account or sign in to
              proceed further.
            </p>
          </div>
        ) : (
          <div>
            {data?.length === 0 ? (
              <div style={{ marginTop: "240px" }}>
                <p className={styles.workoutHeading}>
                  Hello{" "}
                  <span className={styles.email}>{session.user.email}</span>,
                  Welcome to your dashboard
                </p>

                <div className={styles.noWorkout}>
                  <p>You have no workouts yet</p>
                  <Link href="/create">
                    <button className={styles.button}>
                      {" "}
                      Create a New Workout
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: "150px" }}>
                <p className={styles.workoutHeading}>
                  Hello{" "}
                  <span className={styles.email}>{session.user.email}</span>,
                  Welcome to your dashboard
                </p>
                <p className={styles.workoutHeading}>Here are your workouts</p>
                <WorkoutCard data={data} handleDelete={handleDelete} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}