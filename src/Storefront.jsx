import { useEffect, useMemo, useState, useCallback } from "react";
import "./Storefront.css";

const WHATSAPP_NUMBER = "96871142144";
const BASE = import.meta.env.BASE_URL;          // "./" in prod

function money(v) {
  return `${v.toFixed(2)} OMR`;
}

/* ── SVG Icons ── */
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
);
const IconArrowDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
);
const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const IconWhatsApp = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
);
const IconWarn = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

export default function Storefront() {
  /* ── Dynamic products ── */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}data/products.json`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        setOptionMap(Object.fromEntries(data.map((p) => [p.id, p.options[0].id])));
        setQtyMap(Object.fromEntries(data.map((p) => [p.id, 1])));
        setExtrasMap(Object.fromEntries(data.map((p) => [p.id, {}])));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        setLoading(false);
      });
  }, []);

  /* ── State ── */
  const [optionMap, setOptionMap] = useState({});
  const [qtyMap, setQtyMap] = useState({});
  const [extrasMap, setExtrasMap] = useState({});
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [fulfillment, setFulfillment] = useState("delivery"); // "delivery" | "pickup"
  const [form, setForm] = useState({
    name: "",
    location: "",
    notes: ""
  });

  const totalItems = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);
  const totalAmount = useMemo(() => cart.reduce((s, i) => s + i.lineTotal, 0), [cart]);

  /* ── Cart helpers ── */
  const showToast = useCallback((msg) => {
    setToast(null);
    requestAnimationFrame(() => setToast(msg));
    setTimeout(() => setToast(null), 2200);
  }, []);

  const addToCart = (product) => {
    const optId = optionMap[product.id];
    const opt = product.options.find((o) => o.id === optId);
    const qty = Math.max(1, qtyMap[product.id] || 1);
    const selExtras = (product.extras || []).filter((e) => extrasMap[product.id]?.[e.id]);
    const extrasTotal = selExtras.reduce((s, e) => s + e.price, 0);
    const unitPrice = opt.price + extrasTotal;
    const key = `${product.id}-${opt.id}-${selExtras.map((e) => e.id).sort().join("_")}`;

    setCart((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key
            ? { ...i, quantity: i.quantity + qty, lineTotal: (i.quantity + qty) * i.unitPrice }
            : i
        );
      }
      return [
        ...prev,
        {
          key,
          name: product.name,
          optionLabel: `${opt.label} (${opt.pieces} pcs)`,
          extras: selExtras,
          quantity: qty,
          unitPrice,
          lineTotal: qty * unitPrice
        }
      ];
    });

    showToast(`✓ ${product.name} added`);
  };

  const changeQty = (key, d) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.key !== key) return i;
          const next = i.quantity + d;
          return next <= 0 ? null : { ...i, quantity: next, lineTotal: next * i.unitPrice };
        })
        .filter(Boolean)
    );
  };

  const removeItem = (key) => setCart((prev) => prev.filter((i) => i.key !== key));

  /* ── WhatsApp ── */
  const buildMessage = () => {
    const lines = cart
      .map((i) => {
        const ext = i.extras.length ? ` + ${i.extras.map((e) => e.label).join(", ")}` : "";
        return `- ${i.name} | ${i.optionLabel}${ext} × ${i.quantity}`;
      })
      .join("\n");

    const method = fulfillment === "delivery"
      ? `التوصيل: ${form.location || "-"}`
      : "الاستلام من المحل";

    const notesLine = form.notes.trim() ? `\nملاحظات: ${form.notes}` : "";

    return `السلام عليكم\nاريد:\n${lines}\n\nالمجموع: ${money(totalAmount)}\nالاسم: ${form.name || "-"}\n${method}${notesLine}`;
  };

  const proceedToWhatsApp = () => {
    if (!cart.length) return alert("Please add items to your cart first.");
    if (!form.name.trim()) return alert("Please enter your name.");
    if (fulfillment === "delivery" && !form.location.trim())
      return alert("Please enter a delivery location.");

    const msg = encodeURIComponent(buildMessage());
    // Use window.location.href for a same-tab redirect to avoid popup blockers
    window.location.href = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${msg}`;
  };

  /* ── Render ── */
  return (
    <>
      {/* ── Hero ── */}
      <header className="hero">
        <img className="logo" src={`${BASE}images/logo.jpg`} alt="Blossom Sweets" />
        <h1>Welcome to your next craving!</h1>
        <p className="tagline">Bite, enjoy, repeat — stay sweet and choose wisely 🍪</p>

        <a className="hero-cta" href="#menu">
          <IconArrowDown /> Explore Menu
        </a>

        <nav className="contact-bar">
          <a className="contact-pill" href="https://instagram.com/blossom1sweets" target="_blank" rel="noreferrer">
            <IconInstagram /> @blossom1sweets
          </a>
          <a className="contact-pill" href="tel:+96871142144">
            <IconPhone /> +968 71142144
          </a>
          <a className="contact-pill" href="mailto:blossomsweetsOM@gmail.com">
            <IconMail /> Email us
          </a>
        </nav>
      </header>

      {/* ── Body ── */}
      <div className="page-body">
        {/* ── Menu ── */}
        <section id="menu">
          <div className="section-title">
            <h2>Our Menu</h2>
            <p>Pick your treats and add them to cart</p>
          </div>

          <div className="products-grid">
            {loading && <p style={{textAlign:'center',gridColumn:'1/-1',padding:'2rem',color:'#999'}}>Loading menu…</p>}
            {products.map((product) => {
              const selOpt = optionMap[product.id];
              const qty = qtyMap[product.id] || 1;
              const currentOption = product.options.find((o) => o.id === selOpt);

              return (
                <article className="product-card" key={product.id}>
                  <div className="product-image-wrap">
                    {product.image ? (
                      <img className="product-image" src={`${BASE}${product.image}`} alt={product.name} />
                    ) : (
                      <div className="product-placeholder">🍫</div>
                    )}
                    <span className="product-badge">{money(currentOption.price)}</span>
                  </div>

                  <div className="product-body">
                    <h3>{product.name}</h3>
                    <p className="desc">{product.description}</p>

                    <div className="option-group">
                      {product.options.map((opt) => (
                        <label
                          className={`option-pill${selOpt === opt.id ? " selected" : ""}`}
                          key={opt.id}
                        >
                          <input
                            type="radio"
                            name={`opt-${product.id}`}
                            checked={selOpt === opt.id}
                            onChange={() =>
                              setOptionMap((prev) => ({ ...prev, [product.id]: opt.id }))
                            }
                          />
                          {opt.label} · {opt.pieces} pcs
                        </label>
                      ))}
                    </div>

                    {!!product.extras?.length && (
                      <div className="extra-group">
                        {product.extras.map((ex) => (
                          <label
                            className={`extra-chip${extrasMap[product.id]?.[ex.id] ? " checked" : ""}`}
                            key={ex.id}
                          >
                            <input
                              type="checkbox"
                              checked={!!extrasMap[product.id]?.[ex.id]}
                              onChange={(e) =>
                                setExtrasMap((prev) => ({
                                  ...prev,
                                  [product.id]: {
                                    ...(prev[product.id] || {}),
                                    [ex.id]: e.target.checked
                                  }
                                }))
                              }
                            />
                            {ex.label} +{money(ex.price)}
                          </label>
                        ))}
                      </div>
                    )}

                    <div className="card-actions">
                      <div className="stepper">
                        <button
                          type="button"
                          onClick={() =>
                            setQtyMap((p) => ({ ...p, [product.id]: Math.max(1, (p[product.id] || 1) - 1) }))
                          }
                        >
                          −
                        </button>
                        <span className="qty">{qty}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setQtyMap((p) => ({ ...p, [product.id]: (p[product.id] || 1) + 1 }))
                          }
                        >
                          +
                        </button>
                      </div>

                      <button className="add-btn" onClick={() => addToCart(product)}>
                        <IconPlus /> Add
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── Cart Overlay (mobile) ── */}
        <div
          className={`cart-overlay${cartOpen ? " visible" : ""}`}
          onClick={() => setCartOpen(false)}
        />

        {/* ── Cart Panel ── */}
        <aside className={`cart-panel${cartOpen ? " open" : ""}`}>
          <div className="sheet-handle" />
          <div className="cart-header">
            <h2>
              🛒 Cart{" "}
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </h2>
            <button
              className="cart-close"
              onClick={() => setCartOpen(false)}
              style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4 }}
            >
              <IconX />
            </button>
          </div>

          <div className="cart-scroll">
            {!cart.length ? (
              <div className="cart-empty">
                <div className="cart-empty-icon">🧁</div>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-row" key={item.key}>
                      <div className="cart-row-info">
                        <h4>{item.name}</h4>
                        <p>{item.optionLabel}</p>
                        {!!item.extras.length && (
                          <p className="cart-row-extras">
                            + {item.extras.map((e) => e.label).join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="cart-row-right">
                        <strong>{money(item.lineTotal)}</strong>
                        <div className="stepper">
                          <button type="button" onClick={() => changeQty(item.key, -1)}>−</button>
                          <span className="qty">{item.quantity}</span>
                          <button type="button" onClick={() => changeQty(item.key, 1)}>+</button>
                        </div>
                        <button className="remove-btn" onClick={() => removeItem(item.key)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-total">
                  <span>Total</span>
                  <strong>{money(totalAmount)}</strong>
                </div>
              </>
            )}

            <div className="notice-box">
              <IconWarn />
              <span>
                All orders should be made at least one day prior. Same-day orders only
                for ready-made items announced on our Instagram.
              </span>
            </div>

            {/* ── Checkout ── */}
            <div className="checkout-section">
              <h3>Order Details</h3>
              <div className="checkout-fields">
                <input
                  className="field-input"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                />

                <div className="fulfillment-toggle">
                  <button
                    type="button"
                    className={`fulfillment-option${fulfillment === "delivery" ? " active" : ""}`}
                    onClick={() => setFulfillment("delivery")}
                  >
                    🚗 Delivery
                  </button>
                  <button
                    type="button"
                    className={`fulfillment-option${fulfillment === "pickup" ? " active" : ""}`}
                    onClick={() => setFulfillment("pickup")}
                  >
                    🏪 Pickup
                  </button>
                </div>

                {fulfillment === "delivery" && (
                  <input
                    className="field-input delivery-field"
                    type="text"
                    placeholder="Delivery location"
                    value={form.location}
                    onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  />
                )}

                <textarea
                  className="field-input"
                  placeholder="Notes (optional)"
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                />
              </div>
            </div>

            <button
              className="wa-btn"
              onClick={proceedToWhatsApp}
              disabled={!cart.length}
            >
              <IconWhatsApp /> Order via WhatsApp
            </button>
          </div>
        </aside>
      </div>

      {/* ── Mobile FAB ── */}
      <button className="mobile-cart-fab" onClick={() => setCartOpen(true)}>
        🛒
        {totalItems > 0 && <span className="fab-badge">{totalItems}</span>}
      </button>

      {/* ── Toast ── */}
      {toast && <div className="toast">{toast}</div>}

      <footer className="site-footer">
        Powered by Basil
      </footer>
    </>
  );
}
