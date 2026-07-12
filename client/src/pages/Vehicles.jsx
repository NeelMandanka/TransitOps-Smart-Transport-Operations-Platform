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
import { fmtINR, fmtNum } from "../lib/format";

const VEHICLE_TYPES = ["Truck", "Van", "Mini", "Four Wheeler"];
const STATUSES = ["Available", "On Trip", "In Shop", "Retired"];
const REGIONS = ["West", "North", "South", "East", "Central"];

const emptyForm = {
  regNo: "",
  name: "",
  type: "Van",
  capacityKg: "",
  odometerKm: "",
  acquisitionCost: "",
  region: "West",
};

export default function Vehicles() {
  const { token } = useAuth();
  const toast = useToast();
  const [vehicles, setVehicles] = useState([]);

  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");
  const [region, setRegion] = useState("All");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);

  const refresh = () => api.get("/vehicles", token).then(setVehicles).catch(() => {});
  useEffect(() => {
    refresh(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const openAdd = () => {
    setForm(emptyForm);
    setModal({ mode: "add" });
  };
  const openEdit = (v) => {
    setForm({ ...v });
    setModal({ mode: "edit", vehicle: v });
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    const payload = {
      regNo: form.regNo.trim().toUpperCase(),
      name: form.name.trim(),
      type: form.type,
      capacityKg: Number(form.capacityKg || 0),
      odometerKm: Number(form.odometerKm || 0),
      acquisitionCost: Number(form.acquisitionCost || 0),
      region: form.region,
      status: form.status,
    };
    try {
      if (modal.mode === "add") {
        await api.post("/vehicles", payload, token);
        toast.success("Vehicle added");
      } else {
        await api.put(`/vehicles/${modal.vehicle._id}`, payload, token);
        toast.success("Vehicle updated");
      }
      setModal(null);
      refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const retire = async (v) => {
    if (!window.confirm(`Retire ${v.regNo}? It will be hidden from the trip dispatcher.`)) return;
    try {
      await api.patch(`/vehicles/${v._id}/retire`, {}, token);
      toast.success(`${v.regNo} retired`);
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filtered = vehicles.filter(
    (v) =>
      (type === "All" || v.type === type) &&
      (status === "All" || v.status === status) &&
      (region === "All" || v.region === region) &&
      (!search ||
        v.regNo.toLowerCase().includes(search.toLowerCase()) ||
        v.name.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <Layout page="vehicles">
      <PageHeader
        title="Vehicle Registry"
        subtitle={`${vehicles.length} vehicles in fleet`}
        action={<Button onClick={openAdd}>+ Add Vehicle</Button>}
      />

      <div className="toolbar">
        <Select value={type} onChange={(e) => setType(e.target.value)} className="w-auto">
          <option value="All">Type: All</option>
          {VEHICLE_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-auto">
          <option value="All">Status: All</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </Select>
        <Select value={region} onChange={(e) => setRegion(e.target.value)} className="w-auto">
          <option value="All">Region: All</option>
          {REGIONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </Select>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reg. no…"
          className="mono w-64"
        />
      </div>

      <Card className="table-wrap">
        <table>
          <thead>
            <tr>
              <Th>Reg. No. (Unique)</Th>
              <Th>Name / Model</Th>
              <Th>Type</Th>
              <Th className="text-right">Capacity</Th>
              <Th className="text-right">Odometer</Th>
              <Th className="text-right">Acq. Cost</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <EmptyRow colSpan={8} message="No vehicles found." />
            ) : (
              filtered.map((v) => (
                <tr key={v._id}>
                  <Td className="mono bold">{v.regNo}</Td>
                  <Td className="bold">{v.name}</Td>
                  <Td className="muted">{v.type}</Td>
                  <Td className="text-right mono">{fmtNum(v.capacityKg, "kg")}</Td>
                  <Td className="text-right mono">{fmtNum(v.odometerKm, "km")}</Td>
                  <Td className="text-right mono">{fmtINR(v.acquisitionCost)}</Td>
                  <Td>
                    <StatusBadge status={v.status} />
                  </Td>
                  <Td className="text-right">
                    <div className="row-actions">
                      <button className="icon-btn" onClick={() => openEdit(v)} title="Edit">
                        ✎
                      </button>
                      <button
                        className="icon-btn icon-btn-danger"
                        onClick={() => retire(v)}
                        disabled={v.status === "Retired"}
                        title="Retire"
                      >
                        🗄
                      </button>
                    </div>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
      <RuleNote>
        Rule: Registration No. must be unique · Retired/In Shop vehicles are hidden from Trip Dispatcher
      </RuleNote>

      {modal && (
        <Modal
          title={modal.mode === "add" ? "Add Vehicle" : `Edit ${modal.vehicle.regNo}`}
          subtitle="Registration number must be unique"
          onClose={() => setModal(null)}
          wide
        >
          <form onSubmit={save} className="form-grid-2">
            <Field label="Registration No.">
              <Input value={form.regNo} onChange={set("regNo")} placeholder="GJ05JP2218" className="mono" required />
            </Field>
            <Field label="Name / Model">
              <Input value={form.name} onChange={set("name")} placeholder="VAN-05" required />
            </Field>
            <Field label="Type">
              <Select value={form.type} onChange={set("type")}>
                {VEHICLE_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Select>
            </Field>
            <Field label="Region">
              <Select value={form.region} onChange={set("region")}>
                {REGIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </Select>
            </Field>
            <Field label="Max Load Capacity (kg)">
              <Input type="number" min="0" value={form.capacityKg} onChange={set("capacityKg")} required />
            </Field>
            <Field label="Odometer (km)">
              <Input type="number" min="0" value={form.odometerKm} onChange={set("odometerKm")} required />
            </Field>
            <Field label="Acquisition Cost (₹)">
              <Input
                type="number"
                min="0"
                value={form.acquisitionCost}
                onChange={set("acquisitionCost")}
                required
              />
            </Field>
            {modal.mode === "edit" && (
              <Field label="Status">
                <Select value={form.status} onChange={set("status")}>
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </Select>
              </Field>
            )}
            <div className="form-actions form-actions-span2">
              <Button type="button" variant="outline" onClick={() => setModal(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? "Saving…" : "Save Vehicle"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
