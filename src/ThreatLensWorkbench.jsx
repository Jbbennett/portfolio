import { useState } from 'react'
import './ThreatLensWorkbench.css'

const detections = [
  { label: 'Brute-force attempts', note: 'Repeated failed-login behavior selected for review.' },
  { label: 'Suspicious processes', note: 'Process activity selected for analyst investigation.' },
  { label: 'Privilege escalation', note: 'Potential privilege escalation behavior selected for review.' },
  { label: 'Data exfiltration', note: 'Potential data exfiltration behavior selected for review.' },
]

const eventFormats = ['JSON', 'JSONL', 'CSV', 'Sysmon', 'Windows events']
const reportFormats = ['JSON', 'CSV', 'HTML', 'Text']
const pqcSchemes = [
  {
    id: 'frodo',
    label: 'FrodoKEM',
    name: 'FrodoKEM-976-SHAKE',
    classification: 'Standard LWE · comparison baseline',
    publicKey: '15,632 bytes',
    privateKey: '31,296 bytes',
    warmRun: '~20 ms average',
    role: 'Benchmark baseline',
  },
  {
    id: 'mlkem',
    label: 'ML-KEM',
    name: 'ML-KEM-768',
    classification: 'Module-LWE · NIST FIPS 203',
    publicKey: '1,184 bytes',
    privateKey: '2,400 bytes',
    warmRun: '~8 ms average',
    role: 'Hybrid key establishment',
  },
]

const projectFlows = {
  '01': [
    { stage: '01 / RESEARCH', title: 'Lattice cryptography', detail: 'Study quantum-resistant methods' },
    { stage: '02 / IMPLEMENT', title: 'Hybrid cryptosystems', detail: 'C++ algorithm implementation' },
    { stage: '03 / EVALUATE', title: 'Security and performance', detail: 'Analyze scalability and resilience' },
    { stage: '04 / GOAL', title: 'Quantum resistance', detail: 'Research quantum-resistant systems' },
  ],
  '03': [
    { stage: '01 / ARCHITECT', title: 'Scalable structure', detail: 'Plan the site architecture' },
    { stage: '02 / BUILD', title: 'Dynamic interface', detail: 'Develop reusable UI components' },
    { stage: '03 / ORGANIZE', title: 'Structured content', detail: 'Support operations and outreach' },
    { stage: '04 / DEPLOY', title: 'Production website', detail: 'digemaggies.org' },
  ],
  '04': [
    { stage: '01 / SENSE', title: 'Climate readings', detail: 'Temperature and humidity' },
    { stage: '02 / PROCESS', title: 'Embedded software', detail: 'Collect sensor data' },
    { stage: '03 / DEPLOY', title: 'Five campuses', detail: 'Continuous monitoring' },
    { stage: '04 / SUPPORT', title: 'Preventative maintenance', detail: 'Enable earlier intervention' },
  ],
}

function ThreatLensWorkbench({ visible, projects }) {
  const [activeProjectNumber, setActiveProjectNumber] = useState('02')
  const [activeDetection, setActiveDetection] = useState(0)
  const [activePqcSchemeId, setActivePqcSchemeId] = useState('mlkem')
  if (!visible || projects.length === 0) return null

  const selectedProject = projects.find((project) => project.number === activeProjectNumber) ?? projects[0]
  const selectedDetection = detections[activeDetection]
  const selectedPqcScheme = pqcSchemes.find((scheme) => scheme.id === activePqcSchemeId)
  const isThreatLens = selectedProject.number === '02'

  return (
    <section className="threatlens-preview shell" aria-labelledby="threatlens-preview-title">
      <div className="threatlens-preview-heading">
        <div>
          <p className="eyebrow">Interactive project preview</p>
          <h2 id="threatlens-preview-title">Choose a project.<br /><em>Follow its path.</em></h2>
        </div>
        <p>Select a project to explore its focus, process, and evidence.</p>
      </div>
      <div className="workbench">
        <div className="workbench-topbar">
          <span className="workbench-name"><i aria-hidden="true" />{selectedProject.title.toUpperCase()}</span>
          <span className="workbench-disclaimer">{selectedProject.number === '01' ? 'Research snapshot · C++ benchmarks' : 'Illustrative workflow · no live data'}</span>
        </div>
        <div className="workbench-project-picker">
          <span className="workbench-label">Select project</span>
          <div className="workbench-project-options" role="group" aria-label="Choose a project to preview">
            {projects.map((project) => (
              <button
                aria-pressed={selectedProject.number === project.number}
                className={`workbench-project-option ${selectedProject.number === project.number ? 'active' : ''}`}
                key={project.number}
                onClick={() => setActiveProjectNumber(project.number)}
                type="button"
              >
                <span>{project.number}</span>
                <strong>{project.title}</strong>
              </button>
            ))}
          </div>
        </div>
        {isThreatLens ? (
          <div className="workbench-layout">
            <div className="workbench-detections">
              <p className="workbench-label">Choose a detection</p>
              <div className="detection-options" role="group" aria-label="Select a detection category">
                {detections.map((detection, index) => (
                  <button
                    aria-pressed={activeDetection === index}
                    className={`detection-option ${activeDetection === index ? 'active' : ''}`}
                    key={detection.label}
                    onClick={() => setActiveDetection(index)}
                    type="button"
                  >
                    <span className="detection-index">0{index + 1}</span>
                    <span>{detection.label}</span>
                    <span className="detection-arrow" aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="workbench-inspector">
              <div className="selected-signal" aria-live="polite" key={selectedDetection.label}>
                <span className="workbench-label">Selected signal</span>
                <h3>{selectedDetection.label}</h3>
                <p>{selectedDetection.note}</p>
              </div>
              <ol className="workbench-pipeline">
                <li><span>01 / INPUT</span><strong>Event exports</strong><small>{eventFormats.join(' · ')}</small></li>
                <li><span>02 / NORMALIZE</span><strong>Normalize records</strong><small>Structured event data</small></li>
                <li className="pipeline-active"><span>03 / CORRELATE</span><strong>{selectedDetection.label}</strong><small>Detection focus</small></li>
                <li><span>04 / TRIAGE</span><strong>Analyst review</strong><small>Severity · risk · ATT&amp;CK</small></li>
              </ol>
              <div className="workbench-reports"><span className="workbench-label">CLI report formats</span><span>{reportFormats.join(' · ')}</span></div>
            </div>
          </div>
        ) : (
          <div className={`project-preview-flow ${selectedProject.number === '01' ? 'pqc-project-preview' : ''}`}>
            {selectedProject.number !== '01' && <div className="project-preview-intro" aria-live="polite"><span className="workbench-label">{selectedProject.type}</span><h3>{selectedProject.title}</h3><p>{selectedProject.summary ?? selectedProject.description}</p>{selectedProject.links && <div className="project-links">{selectedProject.links.map((link) => <a href={link.url} key={link.url} target="_blank" rel="noreferrer">{link.label}<span aria-hidden="true">↗</span></a>)}</div>}</div>}
            {selectedProject.number === '01' ? (
              <div className="workbench-layout pqc-workbench">
                <div className="workbench-detections">
                  <p className="workbench-label">Choose a KEM</p>
                  <div className="detection-options" role="group" aria-label="Select a KEM scheme">
                    {pqcSchemes.map((scheme, index) => (
                      <button
                        aria-pressed={activePqcSchemeId === scheme.id}
                        className={`detection-option ${activePqcSchemeId === scheme.id ? 'active' : ''}`}
                        key={scheme.id}
                        onClick={() => setActivePqcSchemeId(scheme.id)}
                        type="button"
                      >
                        <span className="detection-index">0{index + 1}</span>
                        <span>{scheme.label}</span>
                        <span className="detection-arrow" aria-hidden="true">↗</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="workbench-inspector">
                  <div className="selected-signal" aria-live="polite" key={selectedPqcScheme.id}>
                    <span className="workbench-label">Selected KEM</span>
                    <h3>{selectedPqcScheme.name}</h3>
                    <p>{selectedPqcScheme.classification}</p>
                  </div>
                  <ol className="workbench-pipeline">
                    <li><span>01 / PUBLIC KEY</span><strong>{selectedPqcScheme.publicKey}</strong><small>Key size</small></li>
                    <li><span>02 / PRIVATE KEY</span><strong>{selectedPqcScheme.privateKey}</strong><small>Key size</small></li>
                    <li className={selectedPqcScheme.id === 'mlkem' ? 'pipeline-active' : ''}><span>03 / WARM RUN</span><strong>{selectedPqcScheme.warmRun}</strong><small>Our C++ tests</small></li>
                    <li><span>04 / ROLE</span><strong>{selectedPqcScheme.role}</strong><small>Hybrid design</small></li>
                  </ol>
                  <p className="pqc-takeaway"><strong>Result:</strong> ML-KEM-768 was ~2.6× faster with ~13× smaller keys in our tests. It is selected for key establishment; AES-256-GCM handles bulk data.</p>
                </div>
              </div>
            ) : (
              <ol className="workbench-pipeline project-flow-pipeline">{projectFlows[selectedProject.number].map((step) => <li key={step.stage}><span>{step.stage}</span><strong>{step.title}</strong><small>{step.detail}</small></li>)}</ol>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default ThreatLensWorkbench