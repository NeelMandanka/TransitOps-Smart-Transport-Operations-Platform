import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import Layout from "../components/Layout";
import {
  Button,
  Card,
  EmptyRow,
  Field,
  Input,
  Modal,
  PageHeader,
  RuleNote,
  Select,
  StatusBadge,
  Td,
  Th,
} from "../components/UI";
import { fmtDate, isExpired, expiresSoon } from "../lib/format";

const STATUSES = ["Available", "On Trip", "Off Duty", "Suspended"];
const CATEGORIES = ["LMV", "HMV", "MCWG", "TRANS"];

const emptyForm = {
  name: "",
  licenseNo: "",
  licenseCategory: "LMV",
  licenseExpiry: "",
  contact: "",
  safetyScore: 100,
  status: "Available",
};

export default function Drivers() {
  const { token } = useAuth();
  const toast = useToast();
  const [drivers, setDrivers] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");

  const refresh = () => api.get("/drivers", token).then(setDrivers).catch(() => {});
  useEffect(() => {
    refresh(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const openAdd = () => {
    setForm(emptyForm);
    setModal({ mode: "add" });
  };
  const openEdit = (d) => {
    setForm({ ...d, licenseExpiry: d.licenseExpiry ? d.licenseExpiry.slice(0, 10) : "" });
    setModal({ mode: "edit", driver: d });
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    const payload = {
      name: form.name.trim(),
      licenseNo: form.licenseNo.trim(),
      licenseCategory: form.licenseCategory,
      licenseExpiry: form.licenseExpiry,
      contact: form.contact,
      safetyScore: Number(form.safetyScore || 0),
      status: form.status,
    };
    try {
      if (modal.mode === "add") {
        await api.post("/drivers", payload, token);
        toast.success("Driver added");
      } else {
        await api.put(`/drivers/${modal.driver._id}`, payload, token);
        toast.success("Driver updated");
      }
      setModal(null);
      refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const filtered = drivers.filter(
    (d) =>
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.licenseNo.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Layout page="drivers">
      <PageHeader
        title="Driver Management"
        subtitle={`${drivers.length} drivers on record`}
        action={<Button onClick={openAdd}>+ Add Driver</Button>}
      />

      <div className="toolbar">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or license no…"
          className="w-72"
        />
      </div>

      <Card className="table-wrap">
        <table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>License No.</Th>
              <Th>Category</Th>
              <Th>License Expiry</Th>
              <Th>Contact</Th>
              <Th className="text-right">Safety Score</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <EmptyRow colSpan={8} message="No drivers found." />
            ) : (
              filtered.map((d) => {
                const expired = isExpired(d.licenseExpiry);
                const soon = expiresSoon(d.licenseExpiry);
                return (
                  <tr key={d._id}>
                    <Td className="bold">{d.name}</Td>
                    <Td className="mono">{d.licenseNo}</Td>
                    <Td className="muted">{d.licenseCategory}</Td>
                    <Td>
                      <span className={`mono ${expired ? "text-danger bold" : soon ? "text-warning bold" : ""}`}>
                        {(expired || soon) && "⚠ "}
                        {fmtDate(d.licenseExpiry)}
                        {expired ? " · Expired" : soon ? " · Expiring soon" : ""}
                      </span>
                    </Td>
                    <Td className="mono muted">{d.contact || "—"}</Td>
                    <Td className="text-right">
                      <span className="safety-score">
                        <span className="safety-bar">
                          <span
                            className={`safety-bar-fill ${
                              d.safetyScore >= 85 ? "fill-success" : d.safetyScore >= 70 ? "fill-warning" : "fill-danger"
                            }`}
                            style={{ width: `${Math.min(100, d.safetyScore)}%` }}
                          />
                        </span>
                        <span className="mono bold">{d.safetyScore}</span>
                      </span>
                    </Td>
                    <Td>
                      <StatusBadge status={d.status} />
                    </Td>
                    <Td className="text-right">
                      <button className="icon-btn" onClick={() => openEdit(d)} title="Edit">
                        ✎
                      </button>
                    </Td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Card>
      <RuleNote>Rule: Drivers with expired licenses or Suspended status cannot be assigned to trips</RuleNote>

      {modal && (
        <Modal title={modal.mode === "add" ? "Add Driver" : `Edit ${modal.driver.name}`} onClose={() => setModal(null)} wide>
          <form onSubmit={save} className="form-grid-2">
            <Field label="Full name">
              <Input value={form.name} onChange={set("name")} required />
            </Field>
            <Field label="License No.">
              <Input value={form.licenseNo} onChange={set("licenseNo")} className="mono" required />
            </Field>
            <Field label="License Category">
              <Select value={form.licenseCategory} onChange={set("licenseCategory")}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label="License Expiry">
              <Input type="date" value={form.licenseExpiry || ""} onChange={set("licenseExpiry")} required />
            </Field>
            <Field label="Contact Number">
              <Input value={form.contact || ""} onChange={set("contact")} />
            </Field>
            <Field label="Safety Score (0–100)">
              <Input type="number" min="0" max="100" value={form.safetyScore} onChange={set("safetyScore")} required />
            </Field>
            <Field label="Status">
              <Select value={form.status} onChange={set("status")}>
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </Field>
            <div className="form-actions">
              <Button type="button" variant="outline" onClick={() => setModal(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? "Saving…" : "Save Driver"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
