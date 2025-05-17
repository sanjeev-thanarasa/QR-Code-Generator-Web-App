import "./QrCode.css";
import React, { useState } from "react";
import { ScaleLoader } from "react-spinners";

export const QrCode = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState("");
  const [qrSize, setQrSize] = useState("");

  async function generateQrCode() {
    if (qrData !== "") {
      setLoading(true);
      setTimeout(() => {
        try {
          const url = `https://api.qrserver.com/v1/create-qr-code/?size=${
            qrSize === "" ? "150" : qrSize
          }x${qrSize === "" ? "150" : qrSize}&data=${encodeURIComponent(
            qrData
          )}`;
          setImg(url);
        } catch (error) {
          console.error("Error generating QR code", error);
        } finally {
          setLoading(false);
        }
      }, 1000); // 1-second delay
    } else {
      alert("Please enter data for QR code");
    }
  }

  function downloadQrCode() {
    fetch(img).then((response) => {
      response
        .blob()
        .then((blob) => {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "qr-code.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) => {
          console.error("Error downloading QR code", error);
        });
    });
  }

  function downloadQrCodeSVG() {
    const svgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${
      qrSize === "" ? "150" : qrSize
    }x${qrSize === "" ? "150" : qrSize}&data=${encodeURIComponent(
      qrData
    )}&format=svg`;

    fetch(svgUrl)
      .then((response) => response.text()) // Get SVG as text
      .then((svgData) => {
        const userConfirmed = window.confirm(
          "Do you want to download the QR code as an SVG file?"
        );
        if (userConfirmed) {
          const blob = new Blob([svgData], { type: "image/svg+xml" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "qr-code.svg";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      })
      .catch((error) => {
        console.error("Error downloading SVG QR code", error);
      });
  }

  return (
    <div className="app-container">
      <h1>QR CODE GENERATOR</h1>
      {loading ? (
        <ScaleLoader color="#3498db" size={50} className="qr-code-image" />
      ) : img === "" ? (
        <img src="./qr-generator.jpeg" className="free-gen-image" />
      ) : (
        <div className="tooltip-container">
          <img
            src={img}
            className="qr-code-image"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && <div className="tooltip">{qrData}</div>}
        </div>
      )}

      <div>
        <label htmlFor="dataInput" className="input-label">
          Data for QR code:
        </label>
        <input
          type="text"
          value={qrData}
          id="dataInput"
          placeholder="Enter data for QR code"
          onChange={(e) => setQrData(e.target.value)}
        />

        <label htmlFor="sizeInput" className="input-label">
          Image size (e.g 150):
        </label>
        <input
          type="text"
          id="sizeInput"
          placeholder="Enter image size Default 150px"
          value={qrSize}
          onChange={(e) => setQrSize(e.target.value)}
        />

        <button
          className="generate-button"
          disabled={loading}
          onClick={() => generateQrCode()}
        >
          Generate QR code
        </button>
        <button className="download-button" onClick={() => downloadQrCode()}>
          Download QR code (PNG)
        </button>

        <button className="download-button" onClick={() => downloadQrCodeSVG()}>
          Download QR code (SVG)
        </button>
      </div>
      <p className="footer">
        Designed by:
        <a href="https://github.com/sanjeev-thanarasa" target="_blank">
          SANJEEV THANARASA
        </a>
      </p>
    </div>
  );
};
