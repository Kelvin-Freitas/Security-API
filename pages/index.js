import Head from 'next/head'
import { useForm } from 'react-hook-form'
import { useContext } from 'react';

export default function Home() {
  const { register, handleSubmit } = useForm();

  async function handleSignIn(data) {
    await signIn(data)
  }

  return (
    <div className="">
      <Head>
        <title>Home</title>
      </Head>

      <div className="">
        <div>
          <h2 className="">Acesse o portal de fofocas</h2>
        </div>
        <form className="" onSubmit={handleSubmit(handleSignIn)}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="">
            <div>
              <label htmlFor="email-address" className="">
                Email 
              </label>
              <input
                {...register('email')}
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className=""
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="">
                Password
              </label>
              <input
                {...register('password')}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className=""
                placeholder="Password"
              />
            </div>
          </div>


          <div>
            <button
              type="submit"
              className=""
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}