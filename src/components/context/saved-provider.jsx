import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
  } from 'react'
  
  const SavedContext = createContext(null)
  
  export function SavedProvider({ children }) {
    const [savedIds, setSavedIds] = useState([])
  
    // Save or remove a listing
    const toggle = useCallback((id) => {
      setSavedIds((prev) =>
        prev.includes(id)
          ? prev.filter((item) => item !== id)
          : [...prev, id],
      )
    }, [])
  
    // Expose saved listing state and actions
    const value = useMemo(
      () => ({
        savedIds,
        toggle,
        isSaved: (id) => savedIds.includes(id),
      }),
      [savedIds, toggle],
    )
  
    return (
      <SavedContext.Provider value={value}>
        {children}
      </SavedContext.Provider>
    )
  }
  
  export function useSaved() {
    const ctx = useContext(SavedContext)
  
    if (!ctx) {
      throw new Error('useSaved must be used inside SavedProvider')
    }
  
    return ctx
  }