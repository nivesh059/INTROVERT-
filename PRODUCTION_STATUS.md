# Production readiness and limitations

## Included in this ZIP
- Express backend with JWT registration/login and authenticated endpoints.
- Prisma/PostgreSQL schema for users, rooms, memberships, messages, friendships, follows, wallet ledger, gifts, notifications.
- LiveKit server-side token endpoint. API secret is read only from backend environment variables.
- Room membership and 12-seat capacity checks.
- Host/admin/speaker role checks for basic mute/remove/promote actions.
- Web UI with black/purple theme, room list, 12 seat display, chat panel, profile, wallet/gifts and leaderboard views.
- LiveKit browser client integration for room audio/video publishing/subscribing.
- Capacitor configuration and GitHub Actions debug APK workflow.

## Not production-ready yet
- **Payments:** coin top-up is intentionally not connected to a payment gateway. Do not sell coins or VIP until payment verification, refunds, tax and store billing are implemented.
- **Moderation:** basic room role controls exist; report queues, trust & safety operations, automated abuse detection and appeals are not complete.
- **Notifications:** in-app notification records are supported; FCM/APNs push delivery is not configured.
- **Presence:** online state and seat updates are MVP-level; use Redis/pub-sub or LiveKit events for reliable multi-instance presence.
- **1-to-1 calls:** use private LiveKit rooms with a 2-person limit; the UI/API foundation supports call rooms, but incoming-call ringing, call history, missed-call handling and robust reconnect flows need implementation.
- **Video calls:** LiveKit video tracks are enabled in the client integration, but production camera permissions, device switching, background handling and quality adaptation need device testing.
- **Country rooms:** country code is a room metadata field/filter; geolocation verification and localization are not implemented.
- **Security:** add rate limiting, email/phone verification, refresh-token rotation, password reset, audit logs, schema validation, CSRF strategy if cookie auth is introduced, and penetration testing.
- **Scale:** no Redis adapter, queue, CDN strategy, observability or load test included.
- **Legal/app stores:** privacy policy, terms, content moderation, age ratings, data deletion and Google Play billing compliance are your responsibility.

Do not advertise this build as fully production-ready. Test on real Android devices and a staging server before release.

## Feature gaps in this ZIP (important)
- The 12 seat grid is currently a visual placeholder; it is not yet synchronized with live participant events.
- Host/admin mute, kick, promote and speaker-request endpoints/UI are not implemented yet. LiveKit's own participant controls are available in the room client, but app-level role authorization is not wired.
- Public room chat is persisted through REST, but live message streaming/polling is not implemented.
- 1-to-1 calling, call invitations/ringing and call history are not implemented. The LiveKit token service is scoped to a joined room; do not treat this as a finished calling feature.
- Private-room invite/access-code flow is not implemented; private rooms are hidden and join is rejected.
- Friend/follow creation endpoints exist, but discovery, request acceptance, lists and follower counts are not implemented in the UI.
- Gifts, coin purchases, VIP purchase/expiry management and rankings by gift activity are not complete. Gift send intentionally returns HTTP 501; no coin balance can be purchased.
- Room theme/background selection, country filters and notification read/mark-as-read UI are not implemented.
- The React/JSX client has not been dependency-installed or production-built in this environment. Backend JavaScript syntax, JSON configuration and ZIP integrity were checked; run the README build steps and resolve any platform-specific dependency issues before release.
