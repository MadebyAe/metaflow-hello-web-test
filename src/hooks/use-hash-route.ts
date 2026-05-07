import { useNavigate, useLocation } from 'react-router-dom'
import { Filter } from '../types'

const FILTER_PATHS: Record<string, Filter> = {
  '/active': 'active',
  '/completed': 'completed',
  '/': 'all',
  '': 'all',
}

const FILTER_TO_PATH: Record<Filter, string> = {
  all: '/',
  active: '/active',
  completed: '/completed',
}

export function useHashRoute(): [Filter, (filter: Filter) => void] {
  const location = useLocation()
  const navigate = useNavigate()

  const currentFilter: Filter = FILTER_PATHS[location.pathname] ?? 'all'

  const setFilter = (filter: Filter) => {
    navigate(FILTER_TO_PATH[filter])
  }

  return [currentFilter, setFilter]
}