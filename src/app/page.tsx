'use client';

import {useCallback, useEffect, useState} from 'react';
import {Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Droplets, RefreshCw, Sun, Wind} from 'lucide-react';

type Day = {date: string; code: number; high: number; low: number};
type City = {name: string; temperature: number; humidity: number; apparent: number; wind: number; code: number; observedAt: string; forecast: Day[]};
type Data = {weather: City[]; unavailable: string[]; updatedAt: string};

function description(code: number) {
  if (code === 0) return '晴';
  if (code <= 2) return '多云';
  if (code === 3) return '阴';
  if (code <= 48) return '雾';
  if (code <= 57) return '毛毛雨';
  if (code <= 67 || code >= 80 && code <= 82) return '雨';
  if (code <= 77 || code >= 85 && code <= 86) return '雪';
  if (code >= 95) return '雷雨';
  return '多云';
}

function Icon({code, className = ''}: {code: number; className?: string}) {
  const props = {className, strokeWidth: 1.8, 'aria-hidden': true as const};
  if (code === 0) return <Sun {...props}/>;
  if (code <= 2) return <CloudSun {...props}/>;
  if (code === 3) return <Cloud {...props}/>;
  if (code <= 48) return <CloudFog {...props}/>;
  if (code <= 57) return <CloudDrizzle {...props}/>;
  if (code <= 67 || code >= 80 && code <= 82) return <CloudRain {...props}/>;
  if (code <= 77 || code >= 85 && code <= 86) return <CloudSnow {...props}/>;
  if (code >= 95) return <CloudLightning {...props}/>;
  return <Cloud {...props}/>;
}

const temp = (n: number) => `${Math.round(n)}°`;
const weekday = (date: string) => new Intl.DateTimeFormat('zh-CN', {timeZone: 'Asia/Shanghai', weekday: 'short'}).format(new Date(`${date}T12:00:00+08:00`));
const updated = (date: string) => new Intl.DateTimeFormat('zh-CN', {timeZone: 'Asia/Shanghai', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'}).format(new Date(date));

export default function Home() {
  const [data, setData] = useState<Data | null>(null);
  const [selected, setSelected] = useState('杭州');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/weather', {cache: 'no-store'});
      if (!response.ok) throw new Error('天气服务暂时不可用');
      const next = await response.json() as Data;
      if (!next.weather.length) throw new Error('暂时无法获取浙江天气');
      setData(next);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '获取天气失败');
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  const active = data?.weather.find(city => city.name === selected) ?? data?.weather[0];

  return <main className="min-h-screen bg-[#eef5fc] text-slate-900">
    <header className="border-b border-blue-100 bg-white/90"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8"><div className="flex items-center gap-3 text-xl font-bold text-blue-900 sm:text-2xl"><CloudSun className="h-8 w-8 text-blue-600"/>WeatherWise <span className="hidden border-l border-slate-300 pl-3 font-medium text-slate-600 sm:inline">浙江天气</span></div><button onClick={() => void refresh()} disabled={loading} className="flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-blue-800 hover:bg-blue-50 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}/>刷新</button></div></header>
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">浙江省天气概览</h1><p className="mt-2 text-slate-600">全省 11 个地级市的当前天气与未来一周预报</p></div>{data && <p className="text-sm text-slate-500">更新于 {updated(data.updatedAt)} · 北京时间</p>}</div>
      {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800">{error}，请稍后重试。</div>}
      {data?.unavailable.length ? <div role="status" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">部分城市暂时无法更新：{data.unavailable.join('、')}</div> : null}
      {!data && loading && <div role="status" className="rounded-2xl bg-white p-10 text-center text-slate-600">正在获取浙江各市天气…</div>}
      {data && active && <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] lg:items-start">
        <section aria-label="浙江各市天气" className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6"><h2 className="mb-5 text-xl font-bold">选择城市</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{data.weather.map(city => <button key={city.name} onClick={() => setSelected(city.name)} aria-pressed={active.name === city.name} className={`rounded-xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 ${active.name === city.name ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}><span className="block font-semibold">{city.name}</span><span className="my-3 flex items-center gap-2"><Icon code={city.code} className="h-7 w-7 text-blue-500"/><strong className="text-2xl">{temp(city.temperature)}</strong></span><span className="block text-sm text-slate-600">{description(city.code)}</span><span className="mt-1 block text-sm text-slate-500">{temp(city.forecast[0].low)} / {temp(city.forecast[0].high)}</span></button>)}</div></section>
        <section aria-label={`${active.name}天气详情`} className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm"><div className="bg-gradient-to-br from-blue-700 via-blue-500 to-sky-300 p-6 text-white sm:p-8"><div className="flex items-start justify-between gap-4"><div><h2 className="text-3xl font-bold">{active.name}</h2><p className="mt-1 text-sm text-blue-50">天气时间 {active.observedAt.replace('T', ' ')} · 北京时间</p></div><Icon code={active.code} className="h-14 w-14"/></div><div className="mt-9 flex items-end gap-4"><span className="text-7xl font-light leading-none sm:text-8xl">{temp(active.temperature)}</span><span className="pb-2 text-xl">{description(active.code)}</span></div><div className="mt-7 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3"><span className="flex items-center gap-2"><Droplets className="h-4 w-4"/>湿度 {active.humidity}%</span><span className="flex items-center gap-2"><Wind className="h-4 w-4"/>风速 {Math.round(active.wind)} km/h</span><span>体感 {temp(active.apparent)}</span></div></div><div className="p-6 sm:p-8"><h3 className="mb-5 text-xl font-bold">未来 7 天</h3><div>{active.forecast.map((day, index) => <div key={day.date} className="flex items-center gap-3 border-b border-slate-100 py-3 last:border-0"><span className="w-20 text-sm font-medium">{index === 0 ? '今天' : weekday(day.date)}</span><Icon code={day.code} className="h-6 w-6 text-blue-500"/><span className="min-w-0 flex-1 text-sm text-slate-600">{description(day.code)}</span><span className="whitespace-nowrap font-semibold">{temp(day.high)} <span className="font-normal text-slate-500">/ {temp(day.low)}</span></span></div>)}</div></div></section>
      </div>}
      <p className="mt-6 text-xs text-slate-500">数据来源：Open-Meteo。当前天气为天气模型估算值，可能与当地气象站观测不同。</p>
    </div>
  </main>;
}
