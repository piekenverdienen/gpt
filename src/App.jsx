import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function App() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");
  const [days, setDays] = useState(3);
  const [ftp, setFtp] = useState(200);
  const [experience, setExperience] = useState("beginner");
  const planRef = useRef(null);

  const handleDownload = async () => {
    const element = planRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("trainingsschema.pdf");
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <div>
          <h2>Wat is je doel?</h2>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Bijv. 150 km cyclo, criterium, FTP verhogen"
          />
          <button onClick={() => setStep(2)} disabled={!goal}>Volgende</button>
        </div>
      );
    }
    if (step === 2) {
      return (
        <div>
          <h2>Hoeveel dagen train je per week?</h2>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            min={1}
            max={7}
          />
          <button onClick={() => setStep(3)}>Volgende</button>
        </div>
      );
    }
    if (step === 3) {
      return (
        <div>
          <h2>Wat is je FTP?</h2>
          <input
            type="number"
            value={ftp}
            onChange={(e) => setFtp(Number(e.target.value))}
          />
          <button onClick={() => setStep(4)}>Volgende</button>
        </div>
      );
    }
    if (step === 4) {
      return (
        <div>
          <h2>Hoeveel ervaring heb je?</h2>
          <select value={experience} onChange={(e) => setExperience(e.target.value)}>
            <option value="beginner">Beginner</option>
            <option value="gemiddeld">Gemiddeld</option>
            <option value="gevorderd">Gevorderd</option>
          </select>
          <button onClick={() => setStep(5)}>Toon schema</button>
        </div>
      );
    }

    const zone1 = Math.round(days * 0.8 * 60);
    const zone3 = Math.round(days * 0.2 * 60);
    const weekdagen = ["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag", "zondag"];
    const trainingsdagen = weekdagen.slice(0, days);
    const intervalDagen = Math.ceil(days * 0.2);

    return (
      <div ref={planRef} style={{ padding: '1rem' }}>
        <h2>Trainingsplan</h2>
        <p><strong>Doel:</strong> {goal}</p>
        <p><strong>Trainingsdagen:</strong> {days} dagen/week</p>
        <p><strong>FTP:</strong> {ftp} Watt</p>
        <p><strong>Niveau:</strong> {experience}</p>
        <h3>Polarized schema:</h3>
        <ul>
          <li>{zone1} min zone 1 (duurtraining)</li>
          <li>{zone3} min zone 3 (intervallen)</li>
        </ul>
        <h3>Weekplanning:</h3>
        <ul>
          {trainingsdagen.map((dag, i) => (
            <li key={dag}>
              {dag}: {i < intervalDagen ? "zone 3 intervallen" : "zone 1 duurtraining"}
            </li>
          ))}
        </ul>
        <button onClick={handleDownload}>Download als PDF</button>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Train als een Pro</h1>
      {renderStep()}
    </div>
  );
}
