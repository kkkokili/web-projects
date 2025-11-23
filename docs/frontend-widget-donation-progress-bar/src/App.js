import "./App.css";
import DonationWidget from "./components/DonationWidget/DonationWidget";
import { getData } from "./api/getData";
import { useEffect, useState } from "react";
import donationWidgetConfig from "./config/donationWidgetConfig";

function App() {
  const { showCenter } = donationWidgetConfig;
  const [data, setData] = useState({
    goal: 1,
    raised: 0,
    donors: 0,
    currency: "CA$",
    campaign: "Support Our Learning Programs",
    lastUpdated: "2025-10-18T14:30:00Z",
    messages: ["Every contribution counts."],
  });

  const [error, setError] = useState({
    error: false,
    message: "",
  });

  useEffect(() => {
    getData()
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        console.error("Error:", {
          status: err.status ?? null,
          message: err.message ?? "Failed to load donation data",
        });

        setError({
          error: true,
          message: "Data load failed",
        });
      });
  }, []);

  // useEffect(() => {
  //   console.log("data updated:", data);
  // }, [data]);

  return (
    //这边有碰到过组件在页面比较小的问题：因为收缩的是 里面那个 <section>（flex item），不是外面的 <div.App>
    <div
      className={
        showCenter ? "App flex justify-center items-center h-screen" : "App"
      }
    >
      <DonationWidget data={data} error={error} />
    </div>
  );
}

export default App;
