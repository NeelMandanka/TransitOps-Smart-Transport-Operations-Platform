import { useEffect, useMemo, useState } from "react";
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
import { fmtINR, fmtNum, todayISO } from "../lib/format";

const emptyForm = {
  source: "",
  destination: "",
  vehicleId: "",
  driverId: "",
  cargoKg: "",
  plannedDistanceKm: "",
  revenue: "",
};

export default function Trips() {
  const { token } = useAuth();
  const toast = useToast();
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [completeTrip, setCompleteTrip] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [completeForm, setCompleteForm] = useState({ endOdometer: "", fuelConsumedL: "" });
  const [busy, setBusy] = useState(false);

  const refresh = () => {
    api.get("/trips", token).then(setTrips).catch(() => {});
    api.get("/vehicles", token).then(setVehicles).catch(() => {});
    api.get("/drivers", token).then(setDrivers).catch(() => {});
  };
  useEffect(() => {
    refresh(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const dispatchableVehicles = vehicles.filter((v) => v.status === "Available");
  const eligibleDrivers = drivers.filter((d) => d.status === "Available" && d.licenseExpiry >= todayISO());

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v._id === form.vehicleId),
    [vehicles, form.vehicleId],
  );
  const overweight = selectedVehicle && Number(form.cargoKg || 0) > Number(selectedVehicle.capacityKg);

  const createTrip = async (e, dispatchNow) => {
    e.preventDefault();
    if (overweight) {
      toast.error(`Cargo weight exceeds ${selectedVehicle.name}'s capacity of ${selectedVehicle.capacityKg} kg`);
      return;
    }
    setBusy(true);
    try {
      await api.post(
        "/trips",
        {
          source: form.source.trim(),
          destination: form.destination.trim(),
          vehicleId: form.vehicleId,
          driverId: form.driverId,
          cargoKg: Number(form.cargoKg || 0),
          plannedDistanceKm: Number(form.plannedDistanceKm || 0),
          revenue: Number(form.revenue || 0),
          dispatchNow,
        },
        token,
      );
      toast.success(dispatchNow ? "Trip dispatched — vehicle & driver are now On Trip" : "Trip saved as draft");
      setCreateOpen(false);
      setForm(emptyForm);
      refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const dispatch = async (trip) => {
    try {
      await api.patch(`/trips/${trip._id}/dispatch`, {}, token);
      toast.success("Trip dispatched — vehicle & driver set to On Trip");
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const cancel = async (trip) => {
    if (!window.confirm("Cancel this trip? Vehicle and driver will be restored to Available.")) return;
    try {
      await api.patch(`/trips/${trip._id}/cancel`, {}, token);
      toast.success("Trip cancelled");
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const complete = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.patch(
        `/trips/${completeTrip._id}/complete`,
        {
          endOdometer: Number(completeForm.endOdometer || 0),
          fuelConsumedL: Number(completeForm.fuelConsumedL || 0),
        },
        token,
      );
      toast.success("Trip completed — vehicle & driver are Available again");
      setCompleteTrip(null);
      setCompleteForm({ endOdometer: "", fuelConsumedL: "" });
      refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Layout page="trips">
      <PageHeader
        title="Trip Dispatcher"
        subtitle={`${trips.filter((t) => t.status === "Dispatched").length} active · ${
          trips.filter((t) => t.status === "Draft").length
        } pending`}
        action={<Button onClick={() => setCreateOpen(true)}>+ New Trip</Button>}
      />

      <Card className="table-wrap">
        <table>
          <thead>
            <tr>
              <Th>Trip</Th>
              <Th>Route</Th>
              <Th>Vehicle</Th>
              <Th>Driver</Th>
              <Th className="text-right">Cargo</Th>
              <Th className="text-right">Distance</Th>
              <Th className="text-right">Revenue</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {trips.length === 0 ? (
              <EmptyRow colSpan={9} message="No trips yet. Create your first trip." />
            ) : (
              trips.map((t) => (
                <tr key={t._id}>
                  <Td className="mono bold">TRP-{String(t.tripNo).padStart(3, "0")}</Td>
                  <Td>
                    <span className="bold">
                      {t.source} → {t.destination}
                    </span>
                  </Td>
                  <Td className="mono">{t.vehicle?.regNo}</Td>
                  <Td>{t.driver?.name}</Td>
                  <Td className="text-right mono">{fmtNum(t.cargoKg, "kg")}</Td>
                  <Td className="text-right mono">{fmtNum(t.plannedDistanceKm, "km")}</Td>
                  <Td className="text-right mono">{fmtINR(t.revenue)}</Td>
                  <Td>
                    <StatusBadge status={t.status} />
                  </Td>
                  <Td className="text-right">
                    <div className="row-actions">
                      {t.status === "Draft" && (
                        <>
                          <Button variant="accent" className="btn-sm" onClick={() => dispatch(t)}>
                            ➤ Dispatch
                          </Button>
                          <Button variant="destructive" className="btn-sm" onClick={() => cancel(t)}>
                            ✕ Cancel
                          </Button>
                        </>
                      )}
                      {t.status === "Dispatched" && (
                        <>
                          <Button
                            variant="success"
                            className="btn-sm"
                            onClick={() => {
                              setCompleteTrip(t);
                              setCompleteForm({ endOdometer: "", fuelConsumedL: "" });
                            }}
                          >
                            ✓ Complete
                          </Button>
                          <Button variant="destructive" className="btn-sm" onClick={() => cancel(t)}>
                            ✕ Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
      <RuleNote>
        Rules: Cargo must not exceed vehicle capacity · Only Available vehicles & drivers with valid licenses
        can be dispatched · Dispatch/Complete/Cancel automatically update vehicle and driver statuses
      </RuleNote>

      {createOpen && (
        <Modal
          title="New Trip"
          subtitle="Retired, In Shop and On Trip vehicles are hidden"
          onClose={() => setCreateOpen(false)}
          wide
        >
          <form onSubmit={(e) => createTrip(e, false)} className="form-grid-2">
            <Field label="Source">
              <Input value={form.source} onChange={set("source")} placeholder="Ahmedabad" required />
            </Field>
            <Field label="Destination">
              <Input value={form.destination} onChange={set("destination")} placeholder="Mumbai" required />
            </Field>
            <Field label="Vehicle (Available only)">
              <Select value={form.vehicleId} onChange={set("vehicleId")} required>
                <option value="">Select vehicle…</option>
                {dispatchableVehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.regNo} · {v.name} · cap {v.capacityKg} kg
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Driver (Available, valid license)">
              <Select value={form.driverId} onChange={set("driverId")} required>
                <option value="">Select driver…</option>
                {eligibleDrivers.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} · {d.licenseCategory}
                  </option>
                ))}
              </Select>
            </Field>
            <Field
              label="Cargo Weight (kg)"
              hint={selectedVehicle ? `Max capacity: ${fmtNum(selectedVehicle.capacityKg, "kg")}` : undefined}
            >
              <Input
                type="number"
                min="0"
                value={form.cargoKg}
                onChange={set("cargoKg")}
                className={overweight ? "input-error" : ""}
                required
              />
            </Field>
            <Field label="Planned Distance (km)">
              <Input type="number" min="0" value={form.plannedDistanceKm} onChange={set("plannedDistanceKm")} required />
            </Field>
            <Field label="Expected Revenue (₹)">
              <Input type="number" min="0" value={form.revenue} onChange={set("revenue")} />
            </Field>
            {overweight && <p className="text-danger bold self-end">Cargo exceeds vehicle capacity!</p>}
            <div className="form-actions form-actions-span2">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="outline" disabled={busy || overweight}>
                Save Draft
              </Button>
              <Button type="button" disabled={busy || overweight} onClick={(e) => createTrip(e, true)}>
                ➤ Dispatch Now
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {completeTrip && (
        <Modal
          title={`Complete TRP-${String(completeTrip.tripNo).padStart(3, "0")}`}
          subtitle="Enter final odometer and fuel consumed"
          onClose={() => setCompleteTrip(null)}
        >
          <form onSubmit={complete} className="form-stack">
            <Field label="Final Odometer (km)">
              <Input
                type="number"
                min="0"
                value={completeForm.endOdometer}
                onChange={(e) => setCompleteForm((f) => ({ ...f, endOdometer: e.target.value }))}
                required
              />
            </Field>
            <Field label="Fuel Consumed (liters)">
              <Input
                type="number"
                min="0"
                step="0.1"
                value={completeForm.fuelConsumedL}
                onChange={(e) => setCompleteForm((f) => ({ ...f, fuelConsumedL: e.target.value }))}
                required
              />
            </Field>
            <div className="form-actions">
              <Button type="button" variant="outline" onClick={() => setCompleteTrip(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="success" disabled={busy}>
                {busy ? "Saving…" : "Complete Trip"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
