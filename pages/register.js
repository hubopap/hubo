import Layout from "@/components/Layout";// importação do layout
import RegisterForm from "@/components/RegisterForm"; // importação do formulario de register que foi criado nos components

//renderização da pagina register com o layout e o formulario de registo importados
export default function Register(){
    
    return(
        <div style={{ overflow: 'hidden' }}>
            <Layout>
                <RegisterForm />
            </Layout>
        </div>
    )
}