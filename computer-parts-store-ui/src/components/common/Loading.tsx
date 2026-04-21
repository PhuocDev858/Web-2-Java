interface LoadingProps {
  message?: string
}

export const Loading = ({ message = 'Loading...' }: LoadingProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block">
          <div className="w-12 h-12 bg-primary-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  )
}
