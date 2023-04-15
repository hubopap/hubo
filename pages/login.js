import LoginForm from '@/components/LoginForm'; //importação do formulario do login criado nos components
import Layout from '@/components/Layout'; //importação do layout 

//renderição da página de login com o layout e o formulário
export default function Login(){
    return(
        <div>
            <Layout>
                <LoginForm/>
            </Layout>
        </div>
    )
}