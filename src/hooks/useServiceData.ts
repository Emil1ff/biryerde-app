import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchServicesStart, fetchServicesSuccess, fetchServicesFailure } from "../redux/slices/serviceSlice"
import type { RootState, AppDispatch } from "../redux/store"
import servicesData from "../data/services.json"
import type { ServiceCategory } from "../Types/data"

export const useServiceData = () => {
  const dispatch: AppDispatch = useDispatch()
  const { categories, isLoading, error } = useSelector((state: RootState) => state.services)

  useEffect(() => {
    const loadServices = async () => {
      dispatch(fetchServicesStart())
      try {

        const data: { categories: ServiceCategory[] } = servicesData

        dispatch(fetchServicesSuccess({ categories: data.categories }))
      } catch (err: any) {
        dispatch(fetchServicesFailure(err.message || "Failed to fetch services"))
      }
    }

    if (categories.length === 0 && !isLoading && !error) {
      loadServices()
    }
  }, [dispatch, categories.length, isLoading, error])

  return { categories, isLoading, error }
}