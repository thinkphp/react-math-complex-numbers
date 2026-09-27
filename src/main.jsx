import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowLeftRight, ArrowUpRight, Divide, Equal, Minus, Plus, RotateCcw, Sparkles, X } from 'lucide-react';
import './style.css';

const operations = [
  { id: 'add', label: 'Addition', symbol: '+', Icon: Plus },
  { id: 'subtract', label: 'Subtraction', symbol: '−', Icon: Minus },
  { id: 'multiply', label: 'Multiplication', symbol: '×', Icon: X },
  { id: 'divide', label: 'Division', symbol: '÷', Icon: Divide },
];

function formatNumber(n) {
  if (Math.abs(n) < 1e-10) n = 0;
  return Number(n.toFixed(6)).toString();
}

function formatComplex({ re, im }) {
  const real = formatNumber(re);
  if (im === 0 || Math.abs(im) < 1e-10) return real;
  const imagAbs = Math.abs(im);
  const imag = imagAbs === 1 ? 'i' : `${formatNumber(imagAbs)}i`;
  if (re === 0 || Math.abs(re) < 1e-10) return im < 0 ? `−${imag}` : imag;
  return `${real} ${im < 0 ? '−' : '+'} ${imag}`;
}

function calculate(a, b, op) {
  if (op === 'add') return { re: a.re + b.re, im: a.im + b.im };
  if (op === 'subtract') return { re: a.re - b.re, im: a.im - b.im };
  if (op === 'multiply') return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re };
  const denominator = b.re * b.re + b.im * b.im;
  if (denominator === 0) return null;
  return { re: (a.re * b.re + a.im * b.im) / denominator, im: (a.im * b.re - a.re * b.im) / denominator };
}

function NumberInput({ title, tag, value, onChange }) {
  return <div className="number-card">
    <div className="field-heading"><span className="field-tag">{tag}</span><span>{title}</span></div>
    <div className="inputs">
      <label><span>Real part</span><div className="input-wrap"><input aria-label={`${title}, real part`} type="number" step="any" value={value.re} onChange={e => onChange({ ...value, re: e.target.value })} /><small>Re</small></div></label>
      <label><span>Imaginary part</span><div className="input-wrap"><input aria-label={`${title}, imaginary part`} type="number" step="any" value={value.im} onChange={e => onChange({ ...value, im: e.target.value })} /><small>Im</small></div></label>
    </div>
    <div className="preview"><span>Algebraic form</span><strong>{formatComplex({ re: Number(value.re) || 0, im: Number(value.im) || 0 })}</strong></div>
  </div>;
}

function App() {
  const [a, setA] = useState({ re: '3', im: '2' });
  const [b, setB] = useState({ re: '1', im: '-4' });
  const [operation, setOperation] = useState('add');
  const [history, setHistory] = useState([]);
  const result = useMemo(() => calculate({ re: Number(a.re) || 0, im: Number(a.im) || 0 }, { re: Number(b.re) || 0, im: Number(b.im) || 0 }, operation), [a, b, operation]);
  const selected = operations.find(item => item.id === operation);

  function saveResult() {
    if (!result) return;
    setHistory(previous => [{ expression: `${formatComplex({ re: Number(a.re) || 0, im: Number(a.im) || 0 })} ${selected.symbol} ${formatComplex({ re: Number(b.re) || 0, im: Number(b.im) || 0 })}`, result: formatComplex(result) }, ...previous].slice(0, 4));
  }

  return <main className="page-shell">
    <header className="topbar"><a className="brand" href="#"><span className="brand-mark">ℂ</span><span>complex<span className="brand-dot">.</span></span></a><span className="top-note"><span className="status-dot" /> Complex number calculator</span></header>
    <section className="hero"><div className="eyebrow"><Sparkles size={14} /> MATH, MADE SIMPLE</div><h1>Complex numbers,<br /><em>clearly calculated.</em></h1><p>Enter two complex numbers and choose an operation. Your result appears instantly.</p></section>
    <section className="calculator" aria-label="Complex number calculator">
      <div className="section-label"><span>01</span> YOUR NUMBERS</div>
      <div className="number-grid"><NumberInput title="First number" tag="z₁" value={a} onChange={setA} /><div className="between"><ArrowLeftRight size={17} /></div><NumberInput title="Second number" tag="z₂" value={b} onChange={setB} /></div>
      <div className="section-label operation-label"><span>02</span> CHOOSE AN OPERATION</div>
      <div className="operation-grid" role="group" aria-label="Operation"><div className="operation-list">{operations.map(({ id, label, symbol, Icon }) => <button key={id} className={`operation-button ${operation === id ? 'active' : ''}`} onClick={() => setOperation(id)} aria-pressed={operation === id}><span className="op-icon"><Icon size={17} strokeWidth={2} /></span><span>{label}</span><kbd>{symbol}</kbd></button>)}</div><span className="operation-hint">Choose an operation to see the result</span></div>
      <div className="result-card"><div className="result-top"><div className="section-label"><span>03</span> RESULT</div><span className="live-badge"><span className="status-dot" /> LIVE</span></div><div className="equation"><span className="equation-term">{formatComplex({ re: Number(a.re) || 0, im: Number(a.im) || 0 })}</span><span className="equation-op">{selected.symbol}</span><span className="equation-term">{formatComplex({ re: Number(b.re) || 0, im: Number(b.im) || 0 })}</span><span className="equation-equal"><Equal size={18} /></span><strong className="answer" aria-live="polite">{result ? formatComplex(result) : 'Undefined'}</strong></div>{!result && <p className="error-note">Division by zero is undefined. Change the second number.</p>}<div className="result-footer"><span>{result ? 'Result updates automatically' : 'Check the denominator and try again'}</span><button className="save-button" onClick={saveResult} disabled={!result}><ArrowUpRight size={15} /> Save</button></div></div>
    </section>
    <section className="history-section"><div className="history-heading"><div className="section-label"><span>↳</span> RECENT CALCULATIONS</div><button onClick={() => setHistory([])} disabled={!history.length}><RotateCcw size={13} /> Clear</button></div>{history.length ? <div className="history-list">{history.map((item, index) => <div className="history-item" key={`${item.expression}-${index}`}><span>{item.expression}</span><strong>{item.result}</strong></div>)}</div> : <p className="empty-history">Saved results will appear here.</p>}</section>
    <footer><span>ℂ</span> Working with <i>z = a + bi</i><span className="footer-right">Built on the rules of complex numbers <ArrowUpRight size={13} /></span></footer>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
