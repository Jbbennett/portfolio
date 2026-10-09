import { useEffect, useState } from 'react'
import './ThreatLensWorkbench.css'

const detections = [
  { label: 'Brute-force attempts', note: 'Repeated failed-login behavior selected for review.' },
  { label: 'Suspicious processes', note: 'Process activity selected for analyst investigation.' },
  { label: 'Privilege escalation', note: 'Potential privilege escalation behavior selected for review.' },
  { label: 'Data exfiltration', note: 'Potential data exfiltration behavior selected for review.' },
]

const eventFormats = ['JSON', 'JSONL', 'CSV', 'Sysmon', 'Windows events']
const reportFormats = ['JSON', 'CSV', 'HTML', 'Text']

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

const simulatorModes = [
  {
    id: 'classical',
    label: 'RSA / ECC',
    sweepDurationMs: 2200,
    strength: 'Quantum-vulnerable public-key assumptions',
    resultTitle: 'Legacy path',
    result: 'A sufficiently capable quantum computer could undermine RSA/ECC key establishment with Shor’s algorithm. This is a conditional risk, not a time-to-crack estimate.',
  },
  {
    id: 'pqc',
    label: 'Lattice-based PQC',
    sweepDurationMs: 7000,
    strength: 'Designed to resist known quantum attacks',
    resultTitle: 'Post-quantum direction',
    result: 'Designed to resist known quantum attacks. Security depends on assumptions and implementation; this is not a guarantee or a crack-time estimate.',
  },
]

function ThreatLensWorkbench({ visible, projects }) {
  const [activeProjectNumber, setActiveProjectNumber] = useState('02')
  const [activeDetection, setActiveDetection] = useState(0)
  if (!visible || projects.length === 0) return null

  const selectedProject = projects.find((project) => project.number === activeProjectNumber) ?? projects[0]
  const selectedDetection = detections[activeDetection]
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
          <span className="workbench-disclaimer">Illustrative workflow · no live data</span>
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
              <div className="pqc-briefing" aria-labelledby="pqc-briefing-title">
                <div className="pqc-briefing-heading">
                  <div>
                    <span className="workbench-label">RSA / ECC vs lattice-based PQC</span>
                    <h3 id="pqc-briefing-title">Why migrate before quantum scale?</h3>
                  </div>
                  <p>PQC runs on classical computers. A sufficiently capable quantum computer could use Shor’s algorithm against RSA/ECC key-establishment assumptions.</p>
                </div>
                <div className="pqc-comparison">
                  <article><h4>RSA / ECC</h4><p>Current public-key methods; vulnerable to Shor at quantum scale.</p></article>
                  <article><h4>Lattice PQC</h4><p>Runs classically; designed to resist known quantum attacks.</p></article>
                </div>
                <p className="pqc-symmetric-note"><strong>Why now:</strong> Harvest-now/decrypt-later puts long-lived data at risk. AES faces a different, quadratic Grover speedup.</p>
                <PqcScenarioSimulator />
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

function PqcScenarioSimulator() {
  const [activeModeId, setActiveModeId] = useState('classical')
  const [isPlaying, setIsPlaying] = useState(true)
  const [timelineProgress, setTimelineProgress] = useState(0)
  const activeMode = simulatorModes.find((mode) => mode.id === activeModeId)

  function togglePlayback() {
    if (isPlaying) {
      setIsPlaying(false)
      setActiveModeId('classical')
      setTimelineProgress(0)
      return
    }

    setIsPlaying(true)
  }

  useEffect(() => {
    if (!isPlaying) return undefined

    const startedAt = performance.now()
    const timer = window.setInterval(() => {
      const progress = (performance.now() - startedAt) / activeMode.sweepDurationMs
      if (progress >= 1) {
        setTimelineProgress(0)
        setActiveModeId((currentModeId) => {
          const currentIndex = simulatorModes.findIndex((mode) => mode.id === currentModeId)
          return simulatorModes[(currentIndex + 1) % simulatorModes.length].id
        })
        return
      }
      setTimelineProgress(progress * 100)
    }, 50)

    return () => window.clearInterval(timer)
  }, [activeMode.sweepDurationMs, isPlaying])

  return (
    <div className={`pqc-simulator mode-${activeMode.id} ${isPlaying ? 'is-playing' : ''}`}>
      <div className="pqc-simulator-heading">
        <div>
          <span className="workbench-label">Relative-resistance animation · illustrative, not crack time</span>
          <h4>Compare quantum-risk paths</h4>
        </div>
        <button className="pqc-simulator-play" type="button" aria-pressed={isPlaying} onClick={togglePlayback}>{isPlaying ? 'Pause' : 'Play'}<span aria-hidden="true">{isPlaying ? 'Ⅱ' : '▶'}</span></button>
      </div>
      <div className="pqc-simulator-methods" role="group" aria-label="Select a key-establishment method">
        {simulatorModes.map((mode) => (
          <button aria-pressed={activeModeId === mode.id} className={`pqc-simulator-method ${activeModeId === mode.id ? 'active' : ''} ${mode.id === 'pqc' ? 'pqc-strength' : ''}`} key={mode.id} onClick={() => { setActiveModeId(mode.id); setIsPlaying(false); setTimelineProgress(0) }} type="button">
            <span>{mode.label}</span><small>{mode.strength}</small>
          </button>
        ))}
      </div>
      <div className="pqc-risk-timeline" aria-label="Illustrative path from encryption today to a hypothetical future quantum-capable computer. Sweep speed shows relative resistance only, not real elapsed time.">
        <div className="pqc-timeline-track" aria-hidden="true">
          <span className="pqc-timeline-progress" style={{ width: `${timelineProgress}%` }} />
          <i /><i /><i />
          <span className="pqc-timeline-marker" style={{ left: `${timelineProgress}%` }} />
        </div>
        <div className="pqc-timeline-labels">
          <div><strong>Today</strong><small>Key established</small></div>
          <div><strong>Data retained</strong><small>Could be captured</small></div>
          <div><strong>Quantum-capable future</strong><small>Hypothetical, no date</small></div>
        </div>
      </div>
      <div className="pqc-simulator-result" aria-live="polite" key={activeMode.id}>
        <strong>{activeMode.resultTitle}</strong>
        <p>{activeMode.result}</p>
      </div>
      <p className="pqc-simulator-footnote">Faster sweep means less resistance in this illustrative comparison; it is not a predicted crack speed. Real attack timing depends on future hardware, parameters, protocol, and implementation.</p>
    </div>
  )
}

export default ThreatLensWorkbench