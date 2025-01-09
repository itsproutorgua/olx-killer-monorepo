import {
  createContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'

interface ProductsContextType {
  count: number
  setCount: Dispatch<SetStateAction<number>>
}

export const ProductsContext = createContext<ProductsContextType | null>({
  count: 0,
  setCount: () => {},
})

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [count, setCount] = useState(0)
  const value = useMemo(() => ({ count, setCount }), [count])

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  )
}
