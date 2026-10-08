import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
    return (
        <div className='
        flex
        flex-col
        justify-center
        h-[100dvh]
        bg-neutral-100
        sm:items-center
        '>
            <div className="register-card">                
                    <RegisterForm/>
        </div>
        </div>
    );
}

export default RegisterPage;