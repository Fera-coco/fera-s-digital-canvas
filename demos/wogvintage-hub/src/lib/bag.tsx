import {createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode} from 'react'

// The bag lives in this browser only. Pieces are one of a kind, so each can be added once.
export type BagItem = {id: string; slug: string}
type Bag = {items: BagItem[]; add: (i: BagItem) => void; remove: (id: string) => void; clear: () => void; has: (id: string) => boolean}

const KEY = 'wog-bag-v1'
const Ctx = createContext<Bag | null>(null)

function read(): BagItem[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(v) ? v.filter((x) => x && typeof x.id === 'string' && typeof x.slug === 'string') : []
  } catch {
    return []
  }
}

export function BagProvider({children}: {children: ReactNode}) {
  const [items, setItems] = useState<BagItem[]>(read)
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* storage blocked: the bag still works for this visit */
    }
  }, [items])
  const add = useCallback((i: BagItem) => setItems((c) => (c.some((x) => x.id === i.id) ? c : [...c, {id: i.id, slug: i.slug}])), [])
  const remove = useCallback((id: string) => setItems((c) => c.filter((x) => x.id !== id)), [])
  const clear = useCallback(() => setItems([]), [])
  const has = useCallback((id: string) => items.some((x) => x.id === id), [items])
  const value = useMemo(() => ({items, add, remove, clear, has}), [items, add, remove, clear, has])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useBag() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useBag outside BagProvider')
  return c
}
