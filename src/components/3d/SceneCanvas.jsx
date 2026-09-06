import VideoFlow from './VideoFlow'
import './SceneCanvas.css'

/**
 * Universal Background Viewport Wrapper
 * Renders the video-matching glowing particle field behind the whole site.
 * (The hero section itself displays the actual zenofest_glowing.mp4 video.)
 */

export default function SceneCanvas() {
  return (
    <div className="scene-canvas-wrapper">
      <VideoFlow />
    </div>
  )
}