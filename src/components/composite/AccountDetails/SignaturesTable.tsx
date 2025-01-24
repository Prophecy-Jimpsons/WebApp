import { formatTimeAgo } from "@/utils/helpers";
import { ConfirmedSignatureInfo } from "@solana/web3.js";
import styles from "./SignaturesTable.module.css";

function SignatureTable({
  signatures,
}: {
  signatures: ConfirmedSignatureInfo[];
}) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Signature</th>
          <th>Slot</th>
          <th>Time</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {signatures &&
          signatures.map((sig: ConfirmedSignatureInfo) => (
            <tr key={sig.signature}>
              <td style={{ fontFamily: "monospace" }}>
                {sig.signature.slice(0, 6)}...{sig.signature.slice(-6)}
              </td>
              <td>{sig.slot}</td>
              <td>{new Date((sig.blockTime ?? 0) * 1000).toLocaleString()}</td>
              <td
                className={
                  sig.confirmationStatus === "finalized"
                    ? styles.statusSuccess
                    : styles.statusFailed
                }
              >
                {sig.confirmationStatus === "finalized" ? "Success" : "Failed"}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default SignatureTable;
