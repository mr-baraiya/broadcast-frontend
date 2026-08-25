import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, ExternalLink } from "lucide-react";

export function BroadcastUrlBox({ matchId }) {
  const [copied, setCopied] = useState(false);

  const fullUrl = `${window.location.origin}/live/${matchId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="control-panel-section">
      <div className="section-title-wrap">
        <h3>OBS BROWSER SOURCE URL</h3>
      </div>
      <p className="section-desc">Paste this URL into OBS Studio as a 1920x1080 Browser Source.</p>

      <div className="url-box-container">
        <input type="text" className="url-input" value={fullUrl} readOnly aria-label="OBS Browser Source URL" />

        <div className="url-actions">
          <button className={`btn-copy ${copied ? "copied" : ""}`} onClick={handleCopy} aria-label="Copy broadcast URL">
            {copied ? (
              <>
                <Check size={14} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy URL</span>
              </>
            )}
          </button>

          <Link to={`/live/${matchId}`} target="_blank" rel="noopener noreferrer" className="btn-open-link" aria-label="Open broadcast page">
            <ExternalLink size={14} />
            <span>Open Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
