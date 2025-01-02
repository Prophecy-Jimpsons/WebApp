import React from "react";
import styles from "./NotFound.module.css";
import { Header } from "@/components/composite/Header";
import { Footer } from "@/components/composite/Footer";
import { Link } from "react-router-dom";
const NotFound: React.FC = () => {
  return (
    <div className={styles.notFound}>
      <Header />
      <main>
        <div>
          <h1>404</h1>
          <h2>Page Not Found :(</h2>
          <p>So sorry, we couldn't find the page you're looking for...</p>
          <Link to="/">Return Home</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
