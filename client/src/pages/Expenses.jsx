import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import Layout from "../components/Layout";
import { Button, Card, EmptyRow, Field, Input, Modal, PageHeader, RuleNote, Select, Td, Th } from "../components/UI";
import { fmtINR, fmtNum, fmtDate, todayISO } from "../lib/format";

const CATEGORIES = ["Toll", "Maintenance", "Fuel", "Parking", "Other"];

export default function Expenses() {
  const { token } = useAuth();
  const toast = useToast();
  const [vehicles, setVehicles] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [maintenance, setMaintenance] = useState([]);

  const [fuelOpen, setFuelOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [fuelForm, setFuelForm] = useState({ vehicleId: "", liters: "", cost: "", logDate: todayISO() });
  const [expForm, setExpForm] = useState({ vehicleId: "", category: "Toll", amount: "", note: "", expenseDate: todayISO() });
  const [busy, setBusy] = useState(false);

  const refresh = () => {
    api.get("/fuel-logs", token).then(setFuelLogs).catch(() => {});
    api.get("/expenses", token).then(setExpenses).catch(() => {});
  };
  useEffect(() => {
    api.get("/vehicles", token).then(setVehicles).catch(() => {});
    api.get("/maintenance", token).then(setMaintenance).catch(() => {});
    refresh(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const saveFuel = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post(
        "/fuel-logs",
        { vehicleId: fuelForm.vehicleId, liters: Number(fuelForm.liters), cost: Number(fuelForm.cost || 0), logDate: fuelForm.logDate },
        token,
      );
      toast.success("Fuel log added");
      setFuelOpen(false);
      refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const saveExpense = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post(
        "/expenses",
        {
          vehicleId: expForm.vehicleId || null,
          category: expForm.category,
          amount: Number(expForm.amount),
          note: expForm.note,
          expenseDate: expForm.expenseDate,
        },
        token,
      );
      toast.success("Expense added");
      setExpenseOpen(false);
      refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const costRows = vehicles.map((v) => {
    const fuel = fuelLogs.filter((f) => f.vehicle?._id === v._id).reduce((s, f) => s + Number(f.cost), 0);
    const maint = maintenance.filter((m) => m.vehicle?._id === v._id).reduce((s, m) => s + Number(m.cost), 0);
    const other = expenses.filter((x) => x.vehicle?._id === v._id).reduce((s, x) => s + Number(x.amount), 0);
    return { ...v, fuel, maint, other, total: fuel + maint + other };
  });

  return (
    <Layout page="expenses">
      <PageHeader
        title="Fuel & Expense Management"
        subtitle="Log fuel fills and operational expenses per vehicle"
        action={
          <div className="btn-row">
            <Button variant="outline" onClick={() => setExpenseOpen(true)}>
              🧾 Add Expense
            </Button>
            <Button onClick={() => setFuelOpen(true)}>⛽ Add Fuel Log</Button>
          </div>
        }
      />

      <h2 className="section-title">Operational cost per vehicle</h2>
      <Card className="table-wrap mb-lg">
        <table>
          <thead>
            <tr>
              <Th>Vehicle</Th>
              <Th className="text-right">Fuel Cost</Th>
              <Th className="text-right">Maintenance</Th>
              <Th className="text-right">Other Expenses</Th>
              <Th className="text-right">Total Operational Cost</Th>
            </tr>
          </thead>
          <tbody>
            {costRows.map((r) => (
              <tr key={r._id}>
                <Td className="mono bold">
                  {r.regNo}
                  <span className="muted" style={{ marginLeft: 8, fontWeight: 400, fontFamily: "inherit" }}>
                    {r.name}
                  </span>
                </Td>
                <Td className="text-right mono">{fmtINR(r.fuel)}</Td>
                <Td className="text-right mono">{fmtINR(r.maint)}</Td>
                <Td className="text-right mono">{fmtINR(r.other)}</Td>
                <Td className="text-right mono bold">{fmtINR(r.total)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="two-col">
        <div>
          <h2 className="section-title">Fuel logs</h2>
          <Card className="table-wrap">
            <table>
              <thead>
                <tr>
                  <Th>Vehicle</Th>
                  <Th>Date</Th>
                  <Th className="text-right">Liters</Th>
                  <Th className="text-right">Cost</Th>
                </tr>
              </thead>
              <tbody>
                {fuelLogs.length === 0 ? (
                  <EmptyRow colSpan={4} message="No fuel logs yet." />
                ) : (
                  fuelLogs.map((f) => (
                    <tr key={f._id}>
                      <Td className="mono bold">{f.vehicle?.regNo}</Td>
                      <Td className="mono muted">{fmtDate(f.logDate)}</Td>
                      <Td className="text-right mono">{fmtNum(f.liters, "L")}</Td>
                      <Td className="text-right mono">{fmtINR(f.cost)}</Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Card>
        </div>
        <div>
          <h2 className="section-title">Other expenses</h2>
          <Card className="table-wrap">
            <table>
              <thead>
                <tr>
                  <Th>Vehicle</Th>
                  <Th>Category</Th>
                  <Th>Note</Th>
                  <Th>Date</Th>
                  <Th className="text-right">Amount</Th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <EmptyRow colSpan={5} message="No expenses yet." />
                ) : (
                  expenses.map((x) => (
                    <tr key={x._id}>
                      <Td className="mono bold">{x.vehicle?.regNo || "—"}</Td>
                      <Td>{x.category}</Td>
                      <Td className="muted truncate">{x.note || "—"}</Td>
                      <Td className="mono muted">{fmtDate(x.expenseDate)}</Td>
                      <Td className="text-right mono">{fmtINR(x.amount)}</Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
      <RuleNote>Total operational cost per vehicle = Fuel + Maintenance + Other expenses (computed automatically)</RuleNote>

      {fuelOpen && (
        <Modal title="Add Fuel Log" onClose={() => setFuelOpen(false)}>
          <form onSubmit={saveFuel} className="form-stack">
            <Field label="Vehicle">
              <Select value={fuelForm.vehicleId} onChange={(e) => setFuelForm((f) => ({ ...f, vehicleId: e.target.value }))} required>
                <option value="">Select vehicle…</option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.regNo} · {v.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Liters">
              <Input type="number" min="0" step="0.1" value={fuelForm.liters} onChange={(e) => setFuelForm((f) => ({ ...f, liters: e.target.value }))} required />
            </Field>
            <Field label="Cost (₹)">
              <Input type="number" min="0" value={fuelForm.cost} onChange={(e) => setFuelForm((f) => ({ ...f, cost: e.target.value }))} required />
            </Field>
            <Field label="Date">
              <Input type="date" value={fuelForm.logDate} onChange={(e) => setFuelForm((f) => ({ ...f, logDate: e.target.value }))} required />
            </Field>
            <div className="form-actions">
              <Button type="button" variant="outline" onClick={() => setFuelOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? "Saving…" : "Add Fuel Log"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {expenseOpen && (
        <Modal title="Add Expense" onClose={() => setExpenseOpen(false)}>
          <form onSubmit={saveExpense} className="form-stack">
            <Field label="Vehicle (optional)">
              <Select value={expForm.vehicleId} onChange={(e) => setExpForm((f) => ({ ...f, vehicleId: e.target.value }))}>
                <option value="">General / no vehicle</option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.regNo} · {v.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Category">
              <Select value={expForm.category} onChange={(e) => setExpForm((f) => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label="Amount (₹)">
              <Input type="number" min="0" value={expForm.amount} onChange={(e) => setExpForm((f) => ({ ...f, amount: e.target.value }))} required />
            </Field>
            <Field label="Note">
              <Input value={expForm.note} onChange={(e) => setExpForm((f) => ({ ...f, note: e.target.value }))} />
            </Field>
            <Field label="Date">
              <Input type="date" value={expForm.expenseDate} onChange={(e) => setExpForm((f) => ({ ...f, expenseDate: e.target.value }))} required />
            </Field>
            <div className="form-actions">
              <Button type="button" variant="outline" onClick={() => setExpenseOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? "Saving…" : "Add Expense"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
