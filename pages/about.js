import Layout from '../components/Layout'; //importalão do layout 

//página about us
export default ()=>(
  <div>
    <Layout>
      <section className="about" id="about" style={{ marginTop: '80px' }}>
        <div className="row">
          <div className="image">
            <img src="static/teamgroup.png" alt="Hubi"  />
          </div>
          <div className="content">
            <h3>We place importance on teamwork</h3>
            <p>
              Collaboration is incredibly important in all areas of work, as computer science students we decided to create
              a platform that helps collaborative work, making it simpler and easier to achieve success.
            </p>
          </div>
        </div>
      </section><br/><br/><br/><br/><br/><br/><br/>
      <section className="ourteam" id="ourteam">
        <h1 className="heading_team">Our Team</h1>
        <div className="box-container_team">
          <div className="box1">
            <img src="static/nunot.png" alt="Nuno Teixeira" />
            <h3>Nuno Teixeira</h3>
            <span>Programmer</span>
            <div className="share">
              <a href="https://github.com/nunoepteixeira" className="github">
                <img src="static/github.png" alt="GitHub" />
              </a>
            </div>
          </div>
          <div className="box1">
            <img src="static/rodrigor.png" alt="Rodrigo Rodrigues" />
            <h3>Rodrigo Rodrigues</h3>
            <span>Programmer</span>
            <div className="share">
              <a href="https://github.com/topi127" className="github">
                <img src="static/github.png" alt="GitHub" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  </div>
);
