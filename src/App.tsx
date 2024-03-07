import React, { useState, useEffect } from "react";

interface Printer {
  id: number;
  name: string;
  status: string;
}

// Preimplimented function to get the users current id
// Function to get the already set user id, change this if you want to change users
function getUserId() {
  return "1";
}
// Function that tells us if we are an admin or not, assume this is set and you can
// adjust the return if you use a different user
function getUserIsAdmin() {
  return true;
}

export default function App(): JSX.Element {

  async function fetchPrinterInformation (): Promise<void> => {
    try {
      const response = await fetch("http://localhost:4000/printer-information/" + getUserId());
      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
  };
  const printers:any = fetchPrinterInformation();
  return (
    <div>
      <h1>Printer Information</h1>
      <ul>{printers.length && printers.map((printer:any) => <li key={printer.id}>{printer.name}</li>)}</ul>
    </div>
  );
}
