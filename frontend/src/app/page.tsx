
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Ping Pong Game",
  description: "Created by Yns Zaka Ayb abechcha",
  viewport: "width=device-width, initial-scale=1.0",
};

export default function Home()
{
  return (

    <div className="pageContainer">
      <h1 style={{ color: "red" }}>This is the opening Page</h1>
      <p>Welcome to the dashboard page!</p>
      <p>Click on the sidebar to navigate.</p>
      <p>Use the navbar for additional options.</p>
      <p>Enjoy your stay!</p>
    </div>
  );
}
