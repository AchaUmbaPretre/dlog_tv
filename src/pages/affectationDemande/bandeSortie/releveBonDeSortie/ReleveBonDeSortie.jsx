import { useEffect, useRef, useState } from 'react';
import './releveBonDeSortie.scss';
import { getVehiculeCourseOne } from '../../../../../services/charroiService';
import config from '../../../../../config';
import html2pdf from 'html2pdf.js';

const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};



const ReleveBonDeSortie = ({ id_bon }) => {
  const [groupedData, setGroupedData] = useState({});
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const pdfRef = useRef();
  const [isLoading, setIsLoading] = useState(true);


const toBase64 = async (url) => {
  // Choix dynamique du domaine en fonction de l'environnement
  const isLocalhost = window.location.hostname === 'localhost';
  const DOMAIN = isLocalhost ? 'http://localhost:8080' : 'https://apidlog.loginsmart-cd.com';

  // On utilise le proxy backend pour convertir l’image
  const proxyUrl = `${DOMAIN}/api/image-proxy?url=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const blob = await response.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Erreur lecture blob en base64'));
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error('❌ Erreur toBase64 proxy :', proxyUrl, err.message);
    return null; // Retourne null si erreur
  }
};


  const fetchDatas = async () => {
      setIsLoading(true);
    try {
      const response = await getVehiculeCourseOne(id_bon);
      const grouped = groupBy(response.data, 'id_bande_sortie');

      for (const group of Object.values(grouped)) {
        for (const entry of group) {
            const fullUrl = `${DOMAIN}/${(entry.signature || '').replace(/^public\//, '')}`;
            const logoUrl = `${DOMAIN}/${(entry.logo || '').replace(/^public\//, '')}`;

            entry.signatureBase64 = await toBase64(fullUrl);
            entry.logoBase64 = await toBase64(logoUrl);
        }
    }


      setGroupedData(grouped);
    } catch (error) {
      console.error(error);
    } finally {
        setIsLoading(false);
    }
  };

  const formatRole = (role) => {
  switch (role) {
    case 'RS':
      return 'RESPONSABLE DE SERVICE';
    case 'RH':
      return 'RESSOURCES HUMAINES';
    case 'Admin':
      return 'DIRECTEUR';
    default:
      return role;
  }
};


  const handleDownloadPDF = () => {
    const element = pdfRef.current;
    const options = {
      margin: 0.3,
      filename: 'autorisation_de_sortie.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(options).from(element).save();
  };

  useEffect(() => {
    fetchDatas();
  }, [id_bon]);

  const SkeletonBonDeSortie = () => {
  return (
    <div className="bon-sortie-wrapper skeleton" style={{ border: '1px solid #ccc', padding: 20, marginBottom: 40 }}>
      <div className="skeleton-box" style={{ height: 100, width: 80, background: '#e0e0e0', marginBottom: 20 }} />
      <div style={{ height: 14, background: '#e0e0e0', width: '60%', marginBottom: 10 }} />
      <div style={{ height: 14, background: '#e0e0e0', width: '40%', marginBottom: 10 }} />
      <div style={{ height: 14, background: '#e0e0e0', width: '70%', marginBottom: 20 }} />
      <div style={{ height: 200, background: '#f0f0f0' }} />
    </div>
  );
};


  return (
    <div className="releveBonDeSortie">
    { isLoading ? (
        <div>
            <SkeletonBonDeSortie />
        </div>
    ) : (
        <>
        <div style={{ marginBottom: '20px', textAlign: 'right' }}>
          <button
            onClick={handleDownloadPDF}
            style={{
              backgroundColor: '#1890ff',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={e => (e.target.style.backgroundColor = '#40a9ff')}
            onMouseLeave={e => (e.target.style.backgroundColor = '#1890ff')}
          >
            🖨️ Imprimer / Exporter en PDF
          </button>
        </div>

      <div ref={pdfRef}>
        {Object.entries(groupedData).map(([id, records]) => {
          const bon = records[0];
          const signataires = records.map(({ personne_signe, role, signatureBase64 }) => ({
            personne_signe,
            role,
            signatureBase64,
          }));

          return (
            <div key={id} className="bon-sortie-wrapper" style={{ border: '1px solid black', padding: 20, marginBottom: 40 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection:'column' }}>
                <div style={{display:'flex', gap:'20px'}}>
                    <img src={bon.logoBase64} alt="" style={{ height:'100px', width:'80px', objectFit:'cover'}} />
                   <div style={{ fontSize: 10 }}>
                    <strong>{bon.nom_societe}</strong><br />
                    {bon?.adresse}<br />
                    RCCM : {bon?.rccm}<br />
                    NIF : {bon?.nif}<br />
                    Tél : {bon?.telephone}<br />
                    Email : {bon?.email}
                    </div>
                </div>
                <div>
                    <h3 style={{textDecoration:'underline', fontSize:'15px', padding:'10px 0', lineHeight:'10px'}}>Département Administratif et des Ressources humaines</h3>
                </div>
                <div style={{ background: '#000', color: '#fff', padding: '10px 20px', alignSelf: 'center' }}>
                  <h2 style={{ margin: 0, fontSize:'14px' }}>AUTORISATION DE SORTIE</h2>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, fontSize: 12 }}>
                <tbody>
                  <tr>
                    <td><strong>Nom :</strong></td>
                    <td>{bon.personne_bord || '...'}</td>
                    <td><strong>Post-nom :</strong></td>
                    <td>{bon.post_nom || '...'}</td>
                    <td><strong>Matricule :</strong></td>
                    <td>{bon.matricule || '...'}</td>
                  </tr>
                  <tr>
                    <td><strong>Service :</strong></td>
                    <td colSpan={5}>{bon.nom_service}</td>
                  </tr>
                  <tr>
                    <td><strong>Heure de sortie :</strong></td>
                    <td>{new Date(bon.date_prevue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} à {new Date(bon.date_retour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td><strong>Date :</strong></td>
                    <td>{new Date(bon.date_prevue).toLocaleDateString()}</td>
                    <td><strong>Chauffeur :</strong></td>
                    <td>{bon.nom || '...'}</td>
                </tr>

                <tr>
                  <td><strong>Destination :</strong></td>
                  <td>{bon.nom_destination}</td>
                </tr>

                  <tr>
                    <td><strong>Véhicule :</strong></td>
                    <td>{bon.nom_marque}</td>
                    <td><strong>Plaque :</strong></td>
                    <td>{bon.immatriculation}</td>
                    <td><strong>Type :</strong></td>
                    <td>{bon.nom_type_vehicule}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ marginTop: 20, fontSize: 13 }}>
                <strong>Motif de sortie :</strong>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  <li>{bon.nom_motif_demande === 'Se rendre au CMM' ? '☑' : '☐'} Se rendre au CMM</li>
                  <li>{bon.nom_motif_demande === 'Enterrement' ? '☑' : '☐'} Assister à un enterrement</li>
                  <li>{bon.nom_motif_demande === 'Course de service' ? '☑' : '☐'} Course de service</li>
                  <li>{!['Se rendre au CMM', 'Enterrement', 'Course de service'].includes(bon.nom_motif_demande)
                    ? '☑' : '☐'} Autre raison : {bon.nom_motif_demande}</li>
                </ul>
              </div>

              {signataires.length === 2 ? (
                <div style={{ display: 'table', width: '100%', marginTop: 30, fontSize: 13 }}>
                    <div style={{ display: 'table-row' }}>
                    <div style={{ display: 'table-cell', textAlign: 'center' }}>
                        {signataires[0]?.signatureBase64 && (
                        <>
                            <img src={signataires[0].signatureBase64} alt="sig" style={{ width: 100, height: 50, objectFit: 'contain' }} /><br />
                            <strong>{formatRole(signataires[0].role)}</strong><br />
                            {signataires[0].personne_signe}
                        </>
                        )}
                    </div>
                    <div style={{ display: 'table-cell', textAlign: 'center', verticalAlign: 'middle' }}>
                        <strong>POUR AVIS ET CONSIDÉRATION</strong>
                    </div>
                    <div style={{ display: 'table-cell', textAlign: 'center' }}>
                        {signataires[1]?.signatureBase64 && (
                        <>
                            <img src={signataires[1].signatureBase64} alt="sig" style={{ width: 100, height: 50, objectFit: 'contain' }} /><br />
                            <strong>{formatRole(signataires[1].role)}</strong><br />
                            {signataires[1].personne_signe}
                        </>
                        )}
                    </div>
                    </div>
                </div>
                ) : (
                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 30, fontSize: 13, gap: 20 }}>
                    {signataires.map((signataire, index) => (
                    <div key={index} style={{ textAlign: 'center' }}>
                        {signataire.signatureBase64 && (
                        <>
                            <img src={signataire.signatureBase64} alt="signature" style={{ width: 100, height: 50, objectFit: 'contain' }} /><br />
                            <strong>{formatRole(signataire.role)}</strong><br />
                            {signataire.personne_signe}
                        </>
                        )}
                    </div>
                    ))}
                </div>
                )}

            </div>
          );
        })}
      </div>
        </>
    ) }
    </div>
  );
};

export default ReleveBonDeSortie;
