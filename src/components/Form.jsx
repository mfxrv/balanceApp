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
        <form className="expense-form" onSubmit={handleSubmit}>
            <label>
                Descripción
                <input
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Ej. Factura Internet"
                />
            </label>
            {errors.description && <small className="error">{errors.description}</small>}

            <label>
                Monto
                <input
                    name="amount"
                    value={form.amount}
                    onChange={(e) => {
                        if (/^[0-9]*[.]?[0-9]{0,2}$/.test(e.target.value) || e.target.value === "") {
                            handleChange(e);
                        }
                    }}
                    placeholder="0.00"
                    inputMode="decimal"
                />
            </label>
            {errors.amount && <small className="error">{errors.amount}</small>}

            <div className="row-inline">
                <label>
                    Categoría
                    <select name="category" value={form.category} onChange={handleChange}>
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Método
                    <select name="payment" value={form.payment} onChange={handleChange}>
                        <option value="efectivo">Efectivo</option>
                        <option value="tarjeta">Tarjeta</option>
                        <option value="transferencia">Transferencia</option>
                    </select>
                </label>

                <label>
                    Fecha
                    <input type="date" name="date" value={form.date} onChange={handleChange} />
                </label>
            </div>

            <button type="submit" className="btn-primary">Guardar gasto</button>
        </form>
    );
};

export default ExpenseForm;
