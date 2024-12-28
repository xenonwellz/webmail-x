import { Suspense, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <Suspense fallback={<div>Loading...</div>}>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router} />
                </QueryClientProvider>
        </Suspense>
    )
}

export default App
