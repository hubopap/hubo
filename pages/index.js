import Layout from '../components/Layout'; //importação do layout
import Link from 'next/link'; //importação do next link para que seja possivel redirecionar entre páginas


// função da página index
const Index = () => (

  
  
  <div>
  <Layout>
    <section className="home" id="home">

        <div className="image">
          <img src="static/home1.png" alt="Hubi"/>
        </div>

        <div className="content">
          <h3>Work smart, Work Hubo </h3>
          <p>Reach Your Collective Goals In The Most Productive, Organized And Effective Way.</p>
        </div>

    </section>
    <section className="features" id="features">

    <h1 className="heading"> Our Features </h1>

    <div className="box-container">

        <div className="box">
            <h3>Create several circles of people</h3>
            <p>With the creation of unlimited groups you can get together and create various work circles.</p>
            <Link href="/register" className="btn"> Start Now <span className=""></span></Link>
        </div>

        <div className="box">
            <h3>Make and assign tasks</h3>
            <p>Using hubo you can create as many tasks as you want and assignment them to any group partner you choose.</p>
        </div>

        <div className="box">
            <h3>Share files with your groups</h3>
            <p>Share files with your partners for the best performance of your organized work.</p>
        </div>
    </div>

      </section>
      <section className="home" id="home">

        <div className="qr-code"  target="_blank">
          <img src="static/qr-code.png" alt="qr" style={{ marginLeft: '250px' }} href="https://hubo.pt:3001/download_apk" />
        </div>

        <div className="content">
          <h3>Get our Mobile App</h3>
          <p>We recomend using the Mobile App to have the best of both worlds. Click or scan the QR Code.</p>
        </div>

      </section>
    </Layout>
  </div> 
);

export default Index; // renderização para o front-end

