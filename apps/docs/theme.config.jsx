import { FaChartArea } from "react-icons/fa";
import { ImNpm } from "react-icons/im";
import Fav from "./public/favicon.ico"

export default {
  logo: <>
    <FaChartArea style={{ color: '#black', fontSize: '1.5rem' }} />
    <b style={{ marginLeft: '0.5ch' }}>Isomorphic SVG Charts</b>
  </>,
  docsRepositoryBase: 'https://github.com/christianjuth/better-react-server-actions/tree/main/apps/docs',
  project: {
    link: 'https://www.npmjs.com/package/better-react-server-actions',
    icon: (
      <div style={{ position: 'relative', height: '2rem' }}>
        <div style={{ position: 'absolute', inset: 5, background: 'white' }} />
        <ImNpm style={{ color: '#d60c0c', height: '2rem', width: '2rem', stroke: 'white', position: 'relative' }} />
      </div>
    )
  },
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{' '}
        Christian Juth
      </span>
    )
  },
  faviconGlyph: "🚀",
  useNextSeoProps() {
    return {
      titleTemplate: '%s - Isomorphic SVG Charts',
    }
  }
}
