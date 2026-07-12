import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import Layout from "../components/Layout";
import { Button, Card, EmptyRow, Field, Input, Modal, PageHeader, RuleNote, Select, StatusBadge, Td, Th } from "../components/UI";
import { fmtINR, fmtDate } from "../lib/format";

const emptyForm = { vehicleId: "", title: "", notes: "", cost: "" };

export default function Maintenance() {
  const { token } = useAuth();
  const toast = useToast();
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);

  const refresh = () => {
    api.get("/maintenance", token).then(setLogs).catch(() => {});
    api.get("/vehicles", token).then(setVehicles).catch(() => {});
  };
  useEffect(() => {
    refresh(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const eligibleVehicles = vehicles.filter((v) => v.status !== "Retired");

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post(
        "/maintenance",
        { vehicleId: form.vehicleId, title: form.title.trim(), notes: form.notes, cost: Number(form.cost || 0) },
        token,
      );
      toast.success("Maintenance record created — vehicle moved to In Shop");
      setOpen(false);
      setForm(emptyForm);
      refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const close = async (log) => {
    try {
      await api.patch(`/maintenance/${log._id}/close`, {}, token);
      toast.success("Maintenance closed — vehicle restored to Available");
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Layout page="maintenance">
      <PageHeader
        title="Maintenance Log"
        subtitle={`${logs.filter((l) => l.status === "Open").length} open records`}
        action={<Button onClick={() => setOpen(true)}>+ New Record</Button>}
      />

      <Card className="table-wrap">
        <table>
          <thead>
            <tr>
              <Th>Vehicle</Th>
              <Th>Work</Th>
              <Th>Notes</Th>
              <Th className="text-right">Cost</Th>
              <Th>Opened</Th>
              <Th>Closed</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <EmptyRow colSpan={8} message="No maintenance records yet." />
            ) : (
              logs.map((l) => (
                <tr key={l._id}>
                  <Td className="mono bold">
                    {l.vehicle?.regNo}
                    <span className="muted" style={{ marginLeft: 8, fontWeight: 400, fontFamily: "inherit" }}>
                      {l.vehicle?.name}
                    </span>
                  </Td>
                  <Td className="bold">{l.title}</Td>
                  <Td className="muted truncate">{l.notes || "—"}</Td>
                  <Td className="text-right mono">{fmtINR(l.cost)}</Td>
                  <Td className="mono muted">{fmtDate(l.openedAt)}</Td>
                  <Td className="mono muted">{fmtDate(l.closedAt)}</Td>
                  <Td>
                    <StatusBadge status={l.status} />
                  </Td>
                  <Td className="text-right">
                    {l.status === "Open" && (
                      <Button variant="success" className="btn-sm" onClick={() => close(l)}>
                        ✓ Close
                      </Button>
                    )}
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
      <RuleNote>
        Rule: Opening a record automatically sets the vehicle to In Shop (hidden from dispatch) · Closing it
        restores the vehicle to Available
      </RuleNote>

      {open && (
        <Modal title="New Maintenance Record" subtitle="The vehicle will automatically move to In Shop" onClose={() => setOpen(false)}>
          <form onSubmit={save} className="form-stack">
            <Field label="Vehicle">
              <Select value={form.vehicleId} onChange={set("vehicleId")} required>
                <option value="">Select vehicle…</option>
                {eligibleVehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.regNo} · {v.name} ({v.status})
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Work / Title">
              <Input value={form.title} onChange={set("title")} placeholder="Oil Change" required />
            </Field>
            <Field label="Notes">
              <Input value={form.notes} onChange={set("notes")} placeholder="Optional details" />
            </Field>
            <Field label="Estimated Cost (₹)">
              <Input type="number" min="0" value={form.cost} onChange={set("cost")} required />
            </Field>
            <div className="form-actions">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? "Saving…" : "Create Record"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
