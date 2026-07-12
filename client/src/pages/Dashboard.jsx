import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { Card, EmptyRow, PageHeader, Select, StatusBadge, Td, Th } from "../components/UI";
import { fmtNum } from "../lib/format";

export default function Dashboard() {
  const { token } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);

  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");
  const [region, setRegion] = useState("All");

  useEffect(() => {
    api.get("/vehicles", token).then(setVehicles).catch(() => {});
    api.get("/drivers", token).then(setDrivers).catch(() => {});
    api.get("/trips", token).then(setTrips).catch(() => {});
  }, [token]);

  const activeFleet = vehicles.filter((v) => v.status !== "Retired");
  const kpis = [
    { label: "Active Vehicles", value: activeFleet.length },
    { label: "Available Vehicles", value: vehicles.filter((v) => v.status === "Available").length },
    { label: "In Maintenance", value: vehicles.filter((v) => v.status === "In Shop").length },
    { label: "Active Trips", value: trips.filter((t) => t.status === "Dispatched").length },
    { label: "Pending Trips", value: trips.filter((t) => t.status === "Draft").length },
    {
      label: "Drivers On Duty",
      value: drivers.filter((d) => d.status === "Available" || d.status === "On Trip").length,
    },
    {
      label: "Fleet Utilization",
      value: activeFleet.length
        ? Math.round((vehicles.filter((v) => v.status === "On Trip").length / activeFleet.length) * 100) + "%"
        : "0%",
      accent: true,
    },
  ];

  const types = ["All", ...new Set(vehicles.map((v) => v.type))];
  const statuses = ["All", "Available", "On Trip", "In Shop", "Retired"];
  const regions = ["All", ...new Set(vehicles.map((v) => v.region))];

  const filtered = vehicles.filter(
    (v) =>
      (type === "All" || v.type === type) &&
      (status === "All" || v.status === status) &&
      (region === "All" || v.region === region),
  );

  return (
    <Layout page="dashboard">
      <PageHeader title="Operations Dashboard" subtitle="Live fleet, trip and driver KPIs" />
      <div className="kpi-grid">
        {kpis.map((k) => (
          <div key={k.label} className={`kpi-card ${k.accent ? "kpi-accent" : ""}`}>
            <p className="kpi-label">{k.label}</p>
            <p className="kpi-value">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <h2 className="section-title mr-auto">Fleet snapshot</h2>
        <Select value={type} onChange={(e) => setType(e.target.value)} className="w-auto">
          {types.map((t) => (
            <option key={t} value={t}>
              {t === "All" ? "Type: All" : t}
            </option>
          ))}
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-auto">
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s === "All" ? "Status: All" : s}
            </option>
          ))}
        </Select>
        <Select value={region} onChange={(e) => setRegion(e.target.value)} className="w-auto">
          {regions.map((r) => (
            <option key={r} value={r}>
              {r === "All" ? "Region: All" : r}
            </option>
          ))}
        </Select>
      </div>

      <Card className="table-wrap">
        <table>
          <thead>
            <tr>
              <Th>Reg. No.</Th>
              <Th>Name / Model</Th>
              <Th>Type</Th>
              <Th>Region</Th>
              <Th className="text-right">Odometer</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <EmptyRow colSpan={6} message="No vehicles match these filters." />
            ) : (
              filtered.map((v) => (
                <tr key={v._id}>
                  <Td className="mono bold">{v.regNo}</Td>
                  <Td className="bold">{v.name}</Td>
                  <Td className="muted">{v.type}</Td>
                  <Td className="muted">{v.region}</Td>
                  <Td className="text-right mono">{fmtNum(v.odometerKm, "km")}</Td>
                  <Td>
                    <StatusBadge status={v.status} />
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </Layout>
  );
}
