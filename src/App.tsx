import React, { useState, useEffect } from "react";

interface Printer {
  id: number;
  name: string;
  status: string;
}

// Preimplimented function to get the users current id
function getUserId() {
  return "1";
}

export default function App(): JSX.Element {
  const [printers, setPrinters] = useState<Printer[]>([]);

  useEffect(() => {
    fetchPrinterInformation();
  }, []);

  const fetchPrinterInformation = async (): Promise<void> => {
    try {
      const response = await fetch("http://localhost:4000/printer-information/" + getUserId());
      console.log("RESPONSE", response);
      const data = await response.json();
      setPrinters(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Printer Information</h1>
      <ul>
        {printers.map((printer) => (
          <li key={printer.id}>{printer.name}</li>
        ))}
      </ul>
    </div>
  );
}
