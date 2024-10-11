'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/Card'
import { Form } from '@/components/ui/form-elements/Form'

import { AuthFields } from './AuthFields'
import { Social } from './Social'
import { useAuthForm } from './useAuthForm'

export function Auth() {
	const [isReg, setIsReg] = useState(false)

	const { onSubmit, form, isPending } = useAuthForm(isReg)

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="h-full w-full lg:w-1/2 flex flex-col items-center justify-center">
				<Card className="border-none p-6 flex flex-col items-center justify-center w-[380px]">
					<CardHeader className="text-center pb-5">
						<CardTitle className="pb-1 text-3xl font-bold">
							{isReg ? 'Create an account' : 'Login to your account'}
						</CardTitle>
						<CardDescription>
							Login or create an account to make purchases!
						</CardDescription>
					</CardHeader>

					<CardContent className="p-0 w-full">
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
								<AuthFields form={form} isPending={isPending} isReg={isReg} />
								<Button disabled={isPending} className="w-full">Continue</Button>
							</form>
						</Form>

						<Social />
					</CardContent>

					<CardFooter className="p-0 mt-4 text-sm text-muted-foreground text-center">
						{isReg ? 'Already have an account?' : "Don't have an account yet?"}
						<button onClick={() => setIsReg(!isReg)} className="ml-1 text-sky-600">
							{isReg ? 'Login' : 'Create'}
						</button>
					</CardFooter>
				</Card>
			</div>
		</div>
	)
}
