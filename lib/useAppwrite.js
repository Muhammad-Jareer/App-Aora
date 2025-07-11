import {useState, useEffect} from 'react'
import { Alert } from 'react-native'

const useAppwrite = (fun) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await fun()

      setData(response)
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  const refetch = () => fetchData()

  return { data, isLoading, refetch }
}

export default useAppwrite;