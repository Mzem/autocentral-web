import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

// Ship Font Awesome's CSS ourselves instead of letting it inject at runtime
// (avoids a flash of oversized icons before hydration). Imported by the header
// of each site so it applies on both.
config.autoAddCss = false
