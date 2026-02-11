import { motion } from 'framer-motion'
import { Disc3, Music2, Mail, Instagram, Facebook, Youtube, Download, Globe, Image } from 'lucide-react'
import { usePageConfig } from '../hooks/usePageConfig'
import { Link } from 'react-router-dom'

// Custom SVG icons for streaming platforms
const SpotifyIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.959-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.361 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
)

const AppleMusicIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
  </svg>
)

const BandcampIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M0 12.5h6.077l2.096-4.5H24l-6.077 4.5L15.827 17H0l8.077-4.5z"/>
  </svg>
)

const TikTokIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.954-1.289-2.066-1.289-3.338v-.8H12.56v14.8c0 2.327-1.892 4.219-4.218 4.219S4.124 17.327 4.124 15c0-2.327 1.892-4.219 4.218-4.219.462 0 .905.075 1.321.213v-3.996c-.436-.061-.88-.092-1.321-.092C3.708 6.906 0 10.614 0 15.25s3.708 8.344 8.342 8.344 8.342-3.708 8.342-8.344v-6.9c1.132.748 2.45 1.15 3.816 1.15v-3.938z"/>
  </svg>
)

const AmazonMusicIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M14.8454 9.4083c-1.3907 1.0194-3.405 1.563-5.1424 1.563a9.333 9.333 0 0 1-6.2768-2.3835c-.1313-.117-.0143-.277.1415-.1846a12.693 12.693 0 0 0 6.285 1.6574c1.5384 0 3.2348-.318 4.7917-.9764.2359-.0985.4328.1538.203.324h-.002zm.5784-.6564c-.1784-.2257-1.1753-.1087-1.6225-.0554-.1374.0164-.158-.1026-.0349-.1867.796-.5558 2.0984-.3958 2.2502-.2092.1539.1867-.041 1.4872-.7856 2.1087-.1149.0964-.2236.0451-.1723-.082.1682-.4165.5436-1.3498.3651-1.5754zm-1.5917-4.1702v-.5394c0-.082.0615-.1375.1374-.1375h2.4348c.078 0 .1395.0554.1395.1354v.4636c0 .078-.0656.1805-.1846.3405L15.0997 6.635c.4677-.0102.9641.0595 1.3887.2974.0964.0534.123.1334.1292.2113v.5744c0 .082-.0882.1723-.1784.123a2.8163 2.8163 0 0 0-2.5723.0062c-.0861.0451-.1743-.0451-.1743-.1251v-.5477c0-.0882.002-.238.0902-.3713l1.4626-2.0881h-1.2718c-.078 0-.1415-.0534-.1436-.1354l.002.002zm4.808-.7466c1.0995 0 1.6944.9395 1.6944 2.1333 0 1.1528-.6564 2.0676-1.6943 2.0676-1.079 0-1.6656-.9395-1.6656-2.1087 0-1.1774.5948-2.0922 1.6656-2.0922zm.0062.7713c-.5456 0-.5805.7384-.5805 1.202 0 .4615-.0061 1.4481.5744 1.4481.5743 0 .601-.7958.601-1.282 0-.318-.0144-.6994-.1108-1.001-.082-.2625-.2482-.3671-.4841-.3671zm-6.008 3.3414c-.0493.041-.1395.0451-.1744.0164-.2543-.1949-.4246-.4923-.4246-.4923-.4061.4123-.6954.5374-1.2225.5374-.6215 0-1.1077-.3835-1.1077-1.1486a1.2512 1.2512 0 0 1 .7897-1.2041c.402-.1764.9641-.2072 1.3928-.2564 0 0 .0349-.4615-.0902-.6297a.521.521 0 0 0-.4164-.1908c-.2728 0-.5395.1477-.5928.4328-.0144.082-.0739.1518-.1395.1436L9.945 5.08a.1292.1292 0 0 1-.1108-.1537c.1641-.8657.9498-1.1282 1.6554-1.1282.361 0 .8307.0964 1.1158.3671.359.3344.3262.7795.3262 1.2677v1.1487c0 .3446.1436.4964.279.681.0471.0677.0574.1477-.002.197-.1519.125-.5703.4881-.5703.4881zm-.7467-1.7969v-.16c-.5353 0-1.1015.115-1.1015.7426 0 .318.1662.5333.4513.5333.2051 0 .3938-.1272.5128-.3344.1436-.2564.1374-.4943.1374-.7815zM2.9278 7.948c-.0472.041-.1375.045-.1723.0163-.2544-.1949-.4246-.4923-.4246-.4923-.4082.4123-.6954.5374-1.2226.5374-.6235 0-1.1076-.3835-1.1076-1.1486a1.2512 1.2512 0 0 1 .7897-1.2041c.402-.1764.964-.2072 1.3928-.2564 0 0 .0348-.4615-.0903-.6297a.521.521 0 0 0-.4164-.1908c-.2748 0-.5395.1477-.5928.4328-.0143.082-.0759.1518-.1395.1436L.2345 5.08a.1292.1292 0 0 1-.1087-.1537c.162-.8657.9497-1.1282 1.6553-1.1282.361 0 .8308.0964 1.1159.3671.359.3344.324.7795.324 1.2677v1.1487c0 .3446.1437.4964.279.681.0472.0677.0575.1477-.002.197-.1518.125-.5702.4881-.5702.4881zm-.7446-1.797v-.16c-.5354 0-1.1015.115-1.1015.7426 0 .318.164.5333.4512.5333.2052 0 .3939-.1272.5128-.3344.1436-.2564.1375-.4943.1375-.7815zm2.9127-.3343v2.002a.1379.1379 0 0 1-.1395.1374H4.218a.1374.1374 0 0 1-.1395-.1374v-3.766a.1379.1379 0 0 1 .1395-.1375h.6913a.1374.1374 0 0 1 .1374.1374v.482h.0143c.1805-.4758.519-.6994.9744-.6994.4636 0 .7528.2236.962.6995a1.0523 1.0523 0 0 1 1.0215-.6995c.3118 0 .6502.1272.8574.4143.236.318.1867.7795.1867 1.1857v2.3855c0 .076-.0636.1354-.1436.1354H8.181a.1374.1374 0 0 1-.1334-.1354v-2.004c0-.16.0144-.558-.0205-.7077-.0554-.2564-.2215-.3282-.4369-.3282a.4923.4923 0 0 0-.441.3118c-.076.1908-.0698.5087-.0698.724v2.0041c0 .076-.0635.1354-.1435.1354h-.7385a.1374.1374 0 0 1-.1333-.1354v-2.004c0-.4226.0677-1.042-.4574-1.042-.5334 0-.5128.603-.5128 1.042h.002zm16.8077 2.002a.1374.1374 0 0 1-.1374.1374h-.7405a.1374.1374 0 0 1-.1374-.1374v-3.766a.1374.1374 0 0 1 .1374-.1375h.683c.0821 0 .1396.0636.1396.1067v.5764h.0143c.2051-.517.4964-.7631 1.0092-.7631.3323 0 .6564.119.8636.4451.1928.3036.1928.8123.1928 1.1774V7.837a.1395.1395 0 0 1-.1415.119h-.7426a.1395.1395 0 0 1-.1313-.119V5.552c0-.763-.2933-.7856-.4635-.7856-.197 0-.357.1538-.4246.2953a1.7025 1.7025 0 0 0-.1231.722l.002 2.0349zM.1914 20.0582c-.1271 0-.1907-.0615-.1907-.1907v-4.4491c0-.1272.0636-.1908.1907-.1908H.616c.0616 0 .1129.0144.1477.039.0349.0246.0595.0738.0718.1436l.0575.3035c.6133-.4184 1.2102-.6276 1.7907-.6276.5948 0 .9969.2256 1.2081.6769.6318-.4513 1.2636-.677 1.8954-.677.441 0 .7794.1231 1.0153.3693.236.2502.3549.603.3549 1.0584v3.3538c0 .1271-.0656.1907-.1928.1907h-.5641c-.1272 0-.1928-.0615-.1928-.1907v-3.085c0-.318-.0616-.5539-.1805-.7057-.1231-.1538-.3139-.2297-.5744-.2297-.4677 0-.9353.1436-1.4092.4307a.997.997 0 0 1 .0103.1416v3.448c0 .1272-.0636.1908-.1908.1908H3.297c-.1272 0-.1908-.0615-.1908-.1907v-3.085c0-.318-.0615-.5539-.1825-.7057-.1231-.1538-.3139-.2297-.5744-.2297-.4861 0-.9517.1395-1.399.4205v3.5999c0 .1271-.0615.1907-.1907.1907H.1914zm9.731.1436c-.4533 0-.8-.1272-1.044-.3815-.242-.2544-.3631-.6133-.3631-1.0769v-3.321c0-.1292.0615-.1927.1908-.1927h.564c.1293 0 .1929.0635.1929.1907v3.0215c0 .3425.0656.5948.201.7569.1333.162.3487.242.642.242.4595 0 .923-.1518 1.3887-.4574v-3.565c0-.1272.0615-.1908.1908-.1908h.564c.1293 0 .1929.0636.1929.1908v4.4511c0 .1252-.0636.1887-.1928.1887h-.4103c-.0636 0-.1149-.0123-.1497-.0369-.0349-.0266-.0575-.0738-.0718-.1436l-.0657-.3323c-.5948.437-1.204.6564-1.8297.6564zm5.4399 0c-.5374 0-1.0195-.0882-1.4461-.2666a.3754.3754 0 0 1-.158-.1047c-.0287-.039-.043-.0984-.043-.1805v-.2687c0-.1148.0369-.1723.1148-.1723.0452 0 .1231.0205.238.0575.4225.1333.8615.199 1.3128.199.3138 0 .5517-.0616.7138-.1806.164-.121.244-.2954.244-.523a.4923.4923 0 0 0-.1476-.3734 1.606 1.606 0 0 0-.5415-.285l-.8144-.3037c-.7097-.2605-1.0625-.7056-1.0625-1.3333 0-.4143.16-.7487.484-1.001.3221-.2543.7447-.3815 1.2677-.3815a3.487 3.487 0 0 1 1.2164.2195c.076.0246.1313.0574.1641.0985.0308.041.0472.1025.0472.1846v.2584c0 .1149-.041.1723-.123.1723a.8615.8615 0 0 1-.2216-.0472 3.5495 3.5495 0 0 0-1.0359-.1538c-.6112 0-.919.2072-.919.6195 0 .164.0514.2953.154.3897.1025.0964.3035.201.603.3159l.7466.2872c.3774.1436.6482.318.8144.519.1661.1989.2482.4574.2482.7753 0 .4513-.1682.8102-.5067 1.0769-.3385.2666-.7877.4-1.3497.4v.002zm3.0645-.1436c-.1272 0-.1928-.0615-.1928-.1907v-4.4491c0-.1272.0656-.1908.1928-.1908h.5641c.1272 0 .1928.0636.1928.1908v4.4511c0 .1251-.0656.1887-.1928.1887h-.564zm.2872-5.688c-.1846 0-.3303-.0513-.437-.1559a.558.558 0 0 1-.1579-.4143c0-.1724.0534-.3098.158-.4144a.5907.5907 0 0 1 .4369-.158c.1846 0 .3282.0534.4349.158.1066.1026.1579.242.1579.4144 0 .1702-.0513.3076-.158.4143-.1046.1026-.2502.1559-.4348.1559zm4.002 5.7926c-.7529 0-1.3293-.2133-1.7272-.642-.4-.4307-.599-1.0502-.599-1.8625 0-.8061.2052-1.4318.6175-1.8728.4102-.441.9948-.6625 1.7476-.6625.3446 0 .683.0615 1.0154.1825.0697.0247.119.0554.1477.0944s.043.1026.043.1908v.2564c0 .1271-.041.1907-.123.1907-.0329 0-.082-.0082-.1539-.0287a2.8307 2.8307 0 0 0-.7959-.1128c-.5353 0-.923.1333-1.1589.404s-.3528.6996-.3528 1.2924v.123c0 .5764.119 1.001.359 1.2718.24.2687.6174.404 1.1343.404.2666 0 .5538-.043.8615-.1332.0718-.0206.119-.0288.1436-.0288.082 0 .1251.0636.1251.1908v.2585c0 .082-.0123.1435-.039.1805-.0246.0369-.0759.0718-.1518.1025-.3138.1354-.6769.201-1.0933.201z"/>
  </svg>
)

const bandMembers = [
  {
    name: 'Chris Binks',
    role: 'Vocals',
  },
  {
    name: 'Benjamin Holmes',
    role: 'Lead Guitar',
  },
  {
    name: 'Chris Poll',
    role: 'Rhythm Guitar',
  },
  {
    name: 'Jay Rutterford',
    role: 'Bass Guitar',
  },
  {
    name: 'Joey Mac',
    role: 'Drums',
  },
]

function EPK() {
  const { epkConfig } = usePageConfig()

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute md:fixed inset-0 z-0 min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/img/album-artwork-without-logo.webp)' }}
        />
        <div className="absolute inset-0 bg-plague-black/85" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        {/* Logo */}
        <motion.img
          src="/img/logo-green.png"
          alt="Plagued"
          className="w-48 md:w-64 mb-8 drop-shadow-[0_0_40px_rgba(0,255,0,0.3)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />

        <p className="font-display text-sm md:text-base uppercase tracking-[0.3em] text-plague-mist/80 mb-12">
          Death Metal • East of England
        </p>

        {/* Content Grid */}
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 card p-6 md:p-8"
          >
            <h2 className="font-display text-xl uppercase tracking-wider text-plague-green mb-4">About</h2>
            <div className="text-plague-mist/80 leading-relaxed space-y-3 text-sm md:text-base">
              <p>
                Plagued is a five-piece death metal band from the East of England, formed in 2024. The band's debut EP, Rotting Dominions, presents old-school death metal with a modern sound, bringing together influences from each of the members, including old-school death metal, Swedish death metal, hardcore, metalcore, and thrash metal.
              </p>
              <p>
                The material is built around riff-driven songwriting, a modern Swedish guitar sound, and powerful, aggressive vocals, combining hardcore grooves with crushing fast death metal riffs.
              </p>
              <p>
                Rotting Dominions serves as Plagued's first recorded statement, establishing the band's foundations and direction.
              </p>
            </div>
            <img
              src="/img/photo-band.jpg"
              alt="Plagued band photo"
              className="w-full mt-6 rounded border border-plague-lighter/20"
            />
          </motion.div>

          {/* Contact & Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            {/* Website */}
            <div className="card p-4">
              <h3 className="font-display text-xs uppercase tracking-wider text-plague-green mb-3 flex items-center gap-2">
                <Globe className="w-3 h-3" />
                Website
              </h3>
              <Link
                to="/"
                className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded text-xs"
              >
                <Globe className="w-3 h-3 text-plague-green" />
                <div className="flex flex-col">
                  <span className="text-plague-mist/70">plagueduk.com</span>
                  <span className="text-plague-mist/50 text-xs">Coming Soon</span>
                </div>
              </Link>
            </div>

            {/* Email */}
            <div className="card p-4">
              <h3 className="font-display text-xs uppercase tracking-wider text-plague-green mb-3 flex items-center gap-2">
                <Mail className="w-3 h-3" />
                Email
              </h3>
              <a
                href="mailto:contact@plagueduk.com"
                className="text-plague-mist/70 hover:text-plague-green transition-colors text-sm block"
              >
                contact@plagueduk.com
              </a>
            </div>

            {/* Social Media */}
            <div className="card p-4">
              <h3 className="font-display text-xs uppercase tracking-wider text-plague-green mb-3">
                Socials
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://www.instagram.com/plagued.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded text-xs"
                >
                  <Instagram className="w-3 h-3 text-plague-green" />
                  <span className="text-plague-mist/70">Instagram</span>
                </a>
                <a
                  href="https://www.facebook.com/Plagued.UK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded text-xs"
                >
                  <Facebook className="w-3 h-3 text-plague-green" />
                  <span className="text-plague-mist/70">Facebook</span>
                </a>
                <a
                  href="https://www.youtube.com/@PlaguedUK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded text-xs"
                >
                  <Youtube className="w-3 h-3 text-plague-green" />
                  <span className="text-plague-mist/70">YouTube</span>
                </a>
                <a
                  href="https://www.tiktok.com/@plagued.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded text-xs"
                >
                  <TikTokIcon className="w-3 h-3 text-plague-green" />
                  <span className="text-plague-mist/70">TikTok</span>
                </a>
              </div>
            </div>

            {/* Streaming */}
            <div className="card p-4">
              <h3 className="font-display text-xs uppercase tracking-wider text-plague-green mb-3">
                Listen On
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://open.spotify.com/artist/5oD38veNZ1ryvzKDH8zJKz?si=xFEdlX-ESoyYUmNHWSXSWw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-plague-lighter/10 border border-plague-green/30 hover:border-plague-green hover:bg-plague-lighter/20 transition-all duration-300 rounded text-xs"
                >
                  <SpotifyIcon className="w-3 h-3 text-plague-green" />
                  <span className="text-plague-mist">Spotify</span>
                </a>
                <a
                  href="https://music.apple.com/us/artist/plagued/1867938771"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-plague-lighter/10 border border-plague-green/30 hover:border-plague-green hover:bg-plague-lighter/20 transition-all duration-300 rounded text-xs"
                >
                  <AppleMusicIcon className="w-3 h-3 text-plague-green" />
                  <span className="text-plague-mist">Apple</span>
                </a>
                <a
                  href="https://plagueduk.bandcamp.com/track/malediction"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-plague-lighter/10 border border-plague-green/30 hover:border-plague-green hover:bg-plague-lighter/20 transition-all duration-300 rounded text-xs"
                >
                  <BandcampIcon className="w-3 h-3 text-plague-green" />
                  <span className="text-plague-mist">Bandcamp</span>
                </a>
                <a
                  href="https://music.amazon.co.uk/artists/B008UZLJZC/the-plagued"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-plague-lighter/10 border border-plague-green/30 hover:border-plague-green hover:bg-plague-lighter/20 transition-all duration-300 rounded text-xs"
                >
                  <AmazonMusicIcon className="w-3 h-3 text-plague-green" />
                  <span className="text-plague-mist">Amazon</span>
                </a>
              </div>
            </div>

            {/* Press Materials / Downloads */}
            <div className="card p-4">
              <h3 className="font-display text-xs uppercase tracking-wider text-plague-green mb-3 flex items-center gap-2">
                <Download className="w-3 h-3" />
                Press Materials
              </h3>
              <div className="space-y-2">
                <a
                  href="https://drive.google.com/drive/folders/1dNfg8aZ__B3bnDBg1RLTEh7TQ4BJ0xpp?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded text-xs"
                >
                  <Music2 className="w-3 h-3 text-plague-green" />
                  <span className="text-plague-mist/70">Download EP (MP3)</span>
                </a>
                <a
                  href="https://drive.google.com/file/d/1wSbv1ih62e-huIFuSvA_f6tMwpaU-a1q/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded text-xs"
                >
                  <Download className="w-3 h-3 text-plague-green" />
                  <span className="text-plague-mist/70">Download Artwork</span>
                </a>
                <a
                  href="https://drive.google.com/drive/folders/1cZfhzg5G22bs-dde6A1QWM9IHGJrn_vc?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded text-xs"
                >
                  <Image className="w-3 h-3 text-plague-green" />
                  <span className="text-plague-mist/70">Band Photos</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Lineup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card p-6"
          >
            <h2 className="font-display text-xl uppercase tracking-wider text-plague-green mb-4">Lineup</h2>
            <div className="space-y-3">
              {bandMembers.map((member) => (
                <div key={member.name} className="border-b border-plague-lighter/10 pb-2 last:border-0">
                  <p className="text-plague-bone text-sm md:text-base font-display tracking-wide">{member.name}</p>
                  <p className="text-plague-green/80 text-xs">{member.role}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Latest Release */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="lg:col-span-2 card p-6"
          >
            <h2 className="font-display text-xl uppercase tracking-wider text-plague-green mb-4">Latest Release</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img
                  src="/img/album-artwork.jpg"
                  alt="Rotting Dominions"
                  className="w-full shadow-2xl shadow-black/30 mb-4"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <Disc3 className="w-4 h-4 text-plague-green" />
                  <span className="font-display text-plague-green uppercase tracking-wider text-xs">
                    Debut EP • 27th February 2026
                  </span>
                </div>
                <h3 className="font-blackletter text-3xl text-plague-bone mb-4">Rotting Dominions</h3>
                <div className="space-y-2 text-sm text-plague-mist/70 mb-4">
                  <div className="flex justify-between border-b border-plague-lighter/10 pb-1">
                    <span className="text-plague-mist/50 text-xs">Produced, Recorded & Mixed</span>
                    <span className="font-display text-plague-bone text-xs">Benjamin Holmes</span>
                  </div>
                  <div className="flex justify-between border-b border-plague-lighter/10 pb-1">
                    <span className="text-plague-mist/50 text-xs">Mastered</span>
                    <span className="font-display text-plague-bone text-xs">Dan Swanö</span>
                  </div>
                  <div className="flex justify-between border-b border-plague-lighter/10 pb-1">
                    <span className="text-plague-mist/50 text-xs">Cover Art</span>
                    <a
                      href="https://www.instagram.com/hyperbholic"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-display text-plague-bone text-xs hover:text-plague-green transition-colors"
                    >
                      Mohammed Khoirul Anam
                    </a>
                  </div>
                </div>
                <p className="text-plague-mist/60 text-xs mb-4">
                  Listen to the full EP below:
                </p>
              </div>
            </div>

            {/* SoundCloud Embed */}
            <div className="mt-6">
              <iframe
                width="100%"
                height="450"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%3Aplaylists%3A2170826408%3Fsecret_token%3Ds-Vt9z2o4tJot&color=%2300ff00&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=false"
                className="rounded border border-plague-lighter/20"
              />
            </div>

            {/* YouTube Video */}
            <div className="mt-6">
              <p className="text-plague-mist/60 text-xs mb-3">
                "Malediction" (Single releasing 30th January):
              </p>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded border border-plague-lighter/20"
                  src="https://www.youtube-nocookie.com/embed/V5wuEUriRUI"
                  title="Plagued - Malediction"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default EPK
