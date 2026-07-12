import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { Button, Card, PageHeader, RuleNote, Td, Th } from "../components/UI";
import { fmtINR, fmtNum, downloadCSV } from "../lib/format";

export default function Reports() {
  const { token } = useAuth();
  const [raw, setRaw] = useState({ vehicles: [], trips: [], fuelLogs: [], maintenance: [], expenses: [] });

  useEffect(() => {
    api.get("/reports/raw", token).then(setRaw).catch(() => {});
  }, [token]);

  const { vehicles, trips, fuelLogs, maintenance, expenses } = raw;

  const rows = vehicles.map((v) => {
    const completed = trips.filter((t) => t.vehicle === v._id && t.status === "Completed");
    const distance = completed.reduce((s, t) => s + Number(t.plannedDistanceKm), 0);
    const tripFuel = completed.reduce((s, t) => s + Number(t.fuelConsumedL || 0), 0);
    const loggedFuel = fuelLogs.filter((f) => f.vehicle === v._id).reduce((s, f) => s + Number(f.liters), 0);
    const fuelLiters = tripFuel || loggedFuel;
    const fuelCost = fuelLogs.filter((f) => f.vehicle === v._id).reduce((s, f) => s + Number(f.cost), 0);
    const maintCost = maintenance.filter((m) => m.vehicle === v._id).reduce((s, m) => s + Number(m.cost), 0);
    const otherCost = expenses.filter((x) => x.vehicle === v._id).reduce((s, x) => s + Number(x.amount), 0);
    const revenue = trips
      .filter((t) => t.vehicle === v._id && t.status === "Completed")
      .reduce((s, t) => s + Number(t.revenue), 0);
    const opCost = fuelCost + maintCost + otherCost;
    const efficiency = fuelLiters > 0 ? distance / fuelLiters : 0;
    const roi = Number(v.acquisitionCost) > 0 ? ((revenue - (maintCost + fuelCost)) / Number(v.acquisitionCost)) * 100 : 0;
    return { regNo: v.regNo, name: v.name, distance, fuelLiters, efficiency, fuelCost, maintCost, opCost, revenue, roi };
  });

  const activeFleet = vehicles.filter((v) => v.status !== "Retired");
  const utilization = activeFleet.length
    ? Math.round((vehicles.filter((v) => v.status === "On Trip").length / activeFleet.length) * 100)
    : 0;
  const totalOpCost = rows.reduce((s, r) => s + r.opCost, 0);
  const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);
  const withEff = rows.filter((r) => r.efficiency > 0);
  const avgEfficiency = withEff.length ? withEff.reduce((s, r) => s + r.efficiency, 0) / withEff.length : 0;

  const maxBar = Math.max(1, ...rows.flatMap((r) => [r.opCost, r.revenue]));

  const exportCSV = () =>
    downloadCSV(
      "transitops-vehicle-report.csv",
      ["Reg No", "Vehicle", "Distance (km)", "Fuel (L)", "Efficiency (km/L)", "Fuel Cost", "Maintenance Cost", "Operational Cost", "Revenue", "ROI (%)"],
      rows.map((r) => [
        r.regNo,
        r.name,
        r.distance,
        r.fuelLiters,
        r.efficiency.toFixed(2),
        r.fuelCost,
        r.maintCost,
        r.opCost,
        r.revenue,
        r.roi.toFixed(2),
      ]),
    );

  const kpis = [
    { label: "Fleet Utilization", value: `${utilization}%` },
    { label: "Total Operational Cost", value: fmtINR(totalOpCost) },
    { label: "Total Revenue (Completed)", value: fmtINR(totalRevenue) },
    { label: "Avg Fuel Efficiency", value: `${avgEfficiency.toFixed(1)} km/L` },
  ];

  return (
    <Layout page="reports">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Fuel efficiency, operational cost and vehicle ROI"
        action={
          <Button onClick={exportCSV} variant="outline">
            ⬇ Export CSV
          </Button>
        }
      />

      <div className="kpi-grid kpi-grid-4 mb-lg">
        {kpis.map((k) => (
          <div key={k.label} className="kpi-card">
            <p className="kpi-label">{k.label}</p>
            <p className="kpi-value kpi-value-sm">{k.value}</p>
          </div>
        ))}
      </div>

      <h2 className="section-title">Operational cost by vehicle</h2>
      <Card className="mb-lg chart-card">
        <div className="bar-chart">
          {rows.length === 0 && <p className="muted">No data yet.</p>}
          {rows.map((r) => (
            <div key={r.regNo} className="bar-group">
              <div className="bar-pair">
                <div
                  className="bar bar-op"
                  style={{ height: `${(r.opCost / maxBar) * 100}%` }}
                  title={`Operational Cost: ${fmtINR(r.opCost)}`}
                />
                <div
                  className="bar bar-rev"
                  style={{ height: `${(r.revenue / maxBar) * 100}%` }}
                  title={`Revenue: ${fmtINR(r.revenue)}`}
                />
              </div>
              <span className="bar-label mono">{r.regNo}</span>
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <span>
            <i className="legend-dot legend-dot-op" /> Operational Cost
          </span>
          <span>
            <i className="legend-dot legend-dot-rev" /> Revenue
          </span>
        </div>
      </Card>

      <h2 className="section-title">Vehicle performance</h2>
      <Card className="table-wrap">
        <table>
          <thead>
            <tr>
              <Th>Vehicle</Th>
              <Th className="text-right">Distance</Th>
              <Th className="text-right">Fuel Used</Th>
              <Th className="text-right">Efficiency</Th>
              <Th className="text-right">Fuel Cost</Th>
              <Th className="text-right">Maintenance</Th>
              <Th className="text-right">Op. Cost</Th>
              <Th className="text-right">Revenue</Th>
              <Th className="text-right">ROI</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.regNo}>
                <Td className="mono bold">
                  {r.regNo}
                  <span className="muted" style={{ marginLeft: 8, fontWeight: 400, fontFamily: "inherit" }}>
                    {r.name}
                  </span>
                </Td>
                <Td className="text-right mono">{fmtNum(r.distance, "km")}</Td>
                <Td className="text-right mono">{fmtNum(r.fuelLiters, "L")}</Td>
                <Td className="text-right mono">{r.efficiency > 0 ? `${r.efficiency.toFixed(1)} km/L` : "—"}</Td>
                <Td className="text-right mono">{fmtINR(r.fuelCost)}</Td>
                <Td className="text-right mono">{fmtINR(r.maintCost)}</Td>
                <Td className="text-right mono bold">{fmtINR(r.opCost)}</Td>
                <Td className="text-right mono">{fmtINR(r.revenue)}</Td>
                <Td className={`text-right mono bold ${r.roi > 0 ? "text-success" : r.roi < 0 ? "text-danger" : ""}`}>
                  {r.roi.toFixed(1)}%
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <RuleNote>ROI = (Revenue − (Maintenance + Fuel)) ÷ Acquisition Cost · Fuel Efficiency = Distance ÷ Fuel consumed</RuleNote>
    </Layout>
  );
}
