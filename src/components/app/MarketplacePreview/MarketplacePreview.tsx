// src/components/composite/MarketplacePreview/MarketplacePreview.tsx
import { FC } from "react";
import Button from "@/components/ui/Button";
import { Link } from "react-router-dom";
import styles from "./MarketplacePreview.module.css";
import PATHS from "@/app/routes/paths";

import JIMP1 from "@/assets/images/App/jimp1.jpg";
import JIMP2 from "@/assets/images/App/jimp2.jpg";
import JIMP3 from "@/assets/images/App/jimp3.jpg";
import JIMP4 from "@/assets/images/App/jimp4.jpg";

const previewNFTs = [
  {
    id: 1,
    title: "JIMP Vision #1234",
    prediction: "JIMP will revolutionize predictive NFTs by Q4 2024",
    price: "100 JIMP",
    image: JIMP1,
    status: "Active",
  },
  {
    id: 2,
    title: "JIMP Insight #5678",
    prediction: "ProphecyJimpsons leads cross-chain predictions market",
    price: "150 JIMP",
    image: JIMP2,
    status: "Verified",
  },
  {
    id: 3,
    title: "JIMP Oracle #9012",
    prediction: "JIMP token listed on major DEX platforms",
    price: "200 JIMP",
    image: JIMP3,
    status: "Active",
  },
  {
    id: 4,
    title: "JIMP Forecast #3456",
    prediction: "ProphecyJimpsons DAO governance launch success",
    price: "120 JIMP",
    image: JIMP4,
    status: "Pending",
  },
];

const MarketplacePreview: FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.highlight}>JIMP</span> Prophecies
          </h2>
          <p className={styles.subtitle}>
            Shape the future through ProphecyJimpsons' unique prediction NFTs
          </p>
        </div>

        <div className={styles.grid}>
          {previewNFTs.map((nft) => (
            <div key={nft.id} className={styles.card}>
              <div className={styles.imageContainer}>
                <div className={styles.imageOverlay} />
                <img src={nft.image} alt={nft.title} className={styles.image} />
                <span
                  className={`${styles.status} ${styles[nft.status.toLowerCase()]}`}
                >
                  {nft.status}
                </span>
              </div>
              <div className={styles.content}>
                <h3 className={styles.nftTitle}>{nft.title}</h3>
                <p className={styles.prediction}>{nft.prediction}</p>
                <div className={styles.footer}>
                  <span className={styles.price}>
                    <span className={styles.priceLabel}>Price:</span>
                    {nft.price}
                  </span>
                  <Link to={`/nft/${nft.id}`} className={styles.viewLink}>
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <Button variant="primary" to={PATHS.PUBLIC.MARKETPLACE}>
            Enter Marketplace
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MarketplacePreview;
