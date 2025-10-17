import React, { useState } from "react";

const ExpenseForm = ({ onAdd }) => {
    const today = new Date().toISOString().slice(0, 10);

    const [form, setForm] = useState({
        description: "",
        amount: "",
        category: "general",
        date: today,
        payment: "efectivo",
    });
    const [errors, setErrors] = useState({});

    const categories = [
        "general",
        "alimentos",
        "transporte",
        "hogar",
        "salud",
        "entretenimiento",
        "educación",
        "otros",
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    };

    const validate = () => {
        const errs = {};
        if (!form.description.trim()) errs.description = "Descripción requerida.";
        if (!form.amount || Number(form.amount) <= 0) errs.amount = "Monto inválido.";
        if (!form.date) errs.date = "Fecha requerida.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const expense = {
            description: form.description.trim(),
            amount: Number(parseFloat(form.amount).toFixed(2)),
            category: form.category,
            date: form.date,
            payment: form.payment,
            createdAt: new Date().toISOString(),
        };

        //Registro de gastos en modo offline con Background Sync
        await onAdd(expense);
        if (typeof navigator !== 'undefined' && !navigator.onLine && 'serviceWorker' in navigator && 'SyncManager' in window) {
            try {
                const reg = await navigator.serviceWorker.ready;
                await reg.sync.register('sync-expenses');
            } catch (err) {
                console.warn('No se pudo registrar Background Sync', err);
            }
        }

        setForm({ ...form, description: "", amount: "" });
    };

    return (
        <form className="modern-form" onSubmit={handleSubmit}>
            <p className="title">Registrar gasto</p>
            <p className="message">Completa los datos para agregar un nuevo gasto.</p>

            {/* Descripción */}
            <label>
                <input
                    required
                    placeholder=""
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="input"
                />
                <span>Descripción</span>
            </label>
            {errors.description && (
                <small className="error">{errors.description}</small>
            )}

            {/* Monto */}
            <label>
                <input
                    required
                    placeholder=""
                    type="text"
                    name="amount"
                    value={form.amount}
                    onChange={(e) => {
                        if (/^[0-9]*[.]?[0-9]{0,2}$/.test(e.target.value) || e.target.value === "") {
                            handleChange(e);
                        }
                    }}
                    className="input"
                    inputMode="decimal"
                />
                <span>Monto</span>
            </label>
            {errors.amount && <small className="error">{errors.amount}</small>}

            {/* Categoría, Método, Fecha */}
            <div className="flex">
                <label>
                    <select
                        required
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="input"
                    >
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                    <span>Categoría</span>
                </label>

                <label>
                    <select
                        required
                        name="payment"
                        value={form.payment}
                        onChange={handleChange}
                        className="input"
                    >
                        <option value="efectivo">Efectivo</option>
                        <option value="tarjeta">Tarjeta</option>
                        <option value="transferencia">Transferencia</option>
                    </select>
                    <span>Método</span>
                </label>
            </div>

            <label>
                <input
                    required
                    placeholder=""
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="input"
                />
                <span>Fecha</span>
            </label>

            <button type="submit" className="submit">
                Guardar gasto
            </button>
        </form>

    );
};

export default ExpenseForm;
