import { FC } from "react";
import { Link } from "react-router-dom";
import PATHS from "@/app/routes/paths";
import styles from "./EnterAppButton.module.css";

const EnterAppButton: FC = () => {
  return (
    <Link to={PATHS.PUBLIC.APP} className={`${styles.button}`}>
      Enter App
    </Link>
  );
};

export default EnterAppButton;
