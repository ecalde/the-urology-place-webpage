/**
 * Streams and posters for Dr. Kella’s Rezūm journey on Vidscrip (same content as the site playlist).
 * Source: https://journeys.vidscrip.com/u/kellanaveenmd?journey=recijjWt8lPzZTCbA&overview=1
 */
export type VidscripPlaylistItem = {
  title: string;
  src: string;
  poster: string;
};

export const REZUM_VIDSCRIP_JOURNEY_URL =
  "https://journeys.vidscrip.com/u/kellanaveenmd?journey=recijjWt8lPzZTCbA&overview=1" as const;

/** “BPH Overview” moment — five videos aligned with Quick 5-Part Overview copy. */
export const REZUM_QUICK_5_VIDEOS: readonly VidscripPlaylistItem[] = [
  {
    title: "What is Benign Prostatic Hyperplasia (BPH)?",
    src: "https://d1fgrjlx888w8f.cloudfront.net/7c6ba98a-b43c-4518-9c14-15a5fb8116e2/hls/fdurdvzvEq_5e94d21b466fe30006e26f35_video.m3u8",
    poster:
      "https://d1fgrjlx888w8f.cloudfront.net/7c6ba98a-b43c-4518-9c14-15a5fb8116e2/thumbnails/fdurdvzvEq_5e94d21b466fe30006e26f35_video_thumb.0000008.jpg",
  },
  {
    title: "How common is BPH?",
    src: "https://d1fgrjlx888w8f.cloudfront.net/b3b1e265-c512-4a2a-abd8-c0b33521134b/hls/RT35NZI2NL_5e94d21b466fe30006e26f36_video.m3u8",
    poster:
      "https://d1fgrjlx888w8f.cloudfront.net/b3b1e265-c512-4a2a-abd8-c0b33521134b/thumbnails/RT35NZI2NL_5e94d21b466fe30006e26f36_video_thumb.0000004.jpg",
  },
  {
    title: "Why do you offer Rezūm to your Patients?",
    src: "https://d1fgrjlx888w8f.cloudfront.net/63995c8f-82ac-4583-ae87-f3cb4de78a5a/hls/lkCIraXekE_5e94d21b466fe30006e26f37_video.m3u8",
    poster:
      "https://d1fgrjlx888w8f.cloudfront.net/63995c8f-82ac-4583-ae87-f3cb4de78a5a/thumbnails/lkCIraXekE_5e94d21b466fe30006e26f37_video_thumb.0000009.jpg",
  },
  {
    title: "What results have you seen with other patients who have chosen Rezūm?",
    src: "https://d1fgrjlx888w8f.cloudfront.net/a618d788-9f5b-4144-ab8f-92996e191cf6/hls/QuWD4QBTrA_5e94d21b466fe30006e26f38_video.m3u8",
    poster:
      "https://d1fgrjlx888w8f.cloudfront.net/a618d788-9f5b-4144-ab8f-92996e191cf6/thumbnails/QuWD4QBTrA_5e94d21b466fe30006e26f38_video_thumb.0000010.jpg",
  },
  {
    title: "How does Rezūm work?",
    src: "https://d1fgrjlx888w8f.cloudfront.net/7e3c3abc-6916-4277-8b47-849dc502f2cb/hls/funmNojC1V_5e94d21b466fe30006e26f39_video.m3u8",
    poster:
      "https://d1fgrjlx888w8f.cloudfront.net/7e3c3abc-6916-4277-8b47-849dc502f2cb/thumbnails/funmNojC1V_5e94d21b466fe30006e26f39_video_thumb.0000010.jpg",
  },
];

/** “Procedure Overview” moment — ten videos aligned with Quick 10-Part Overview copy. */
export const REZUM_QUICK_10_VIDEOS: readonly VidscripPlaylistItem[] = [
  {
    title: "How does Rezūm work?",
    src: "https://d1fgrjlx888w8f.cloudfront.net/33c74c8e-b332-4f30-bb5d-433ba4d26321/hls/72TupmSVXw_5e94d424ee62b6000723bc92_video.m3u8",
    poster:
      "https://d1fgrjlx888w8f.cloudfront.net/33c74c8e-b332-4f30-bb5d-433ba4d26321/thumbnails/72TupmSVXw_5e94d424ee62b6000723bc92_video_thumb.0000007.jpg",
  },
  {
    title: "What is the success rate with Rezūm?",
    src: "https://d1fgrjlx888w8f.cloudfront.net/5bd8b6c8-500b-434c-8f6c-04706286c8c2/hls/B7KbJwQV7o_5e94d424ee62b6000723bc93_video.m3u8",
    poster:
      "https://d1fgrjlx888w8f.cloudfront.net/5bd8b6c8-500b-434c-8f6c-04706286c8c2/thumbnails/B7KbJwQV7o_5e94d424ee62b6000723bc93_video_thumb.0000006.jpg",
  },
  {
    title: "How long will my BPH symptom relief last?",
    src: "https://d1fgrjlx888w8f.cloudfront.net/6dd30db2-05ae-4f4e-954a-7cbd2f54b2b7/hls/osPLv3HizF_5e94d424ee62b6000723bc94_video.m3u8",
    poster:
      "https://d1fgrjlx888w8f.cloudfront.net/6dd30db2-05ae-4f4e-954a-7cbd2f54b2b7/thumbnails/osPLv3HizF_5e94d424ee62b6000723bc94_video_thumb.0000009.jpg",
  },
  {
    title: "What is the healing process my body will go through?",
    src: "https://d1fgrjlx888w8f.cloudfront.net/12f8746b-1bb4-47e6-a323-ebb98e653f3f/hls/RZ1miot9RU_5e94d424ee62b6000723bc95_video.m3u8",
    poster:
      "https://d1fgrjlx888w8f.cloudfront.net/12f8746b-1bb4-47e6-a323-ebb98e653f3f/thumbnails/RZ1miot9RU_5e94d424ee62b6000723bc95_video_thumb.0000015.jpg",
  },
  {
    title: "Will I experience discomfort during or after the Rezūm procedure?",
    src: "https://d1fgrjlx888w8f.cloudfront.net/caba6c76-c906-4fc7-8a58-4ba44ca5bd04/hls/v0Pk6OE2vr_5e94d424ee62b6000723bc96_video.m3u8",
    poster:
      "https://d1fgrjlx888w8f.cloudfront.net/caba6c76-c906-4fc7-8a58-4ba44ca5bd04/thumbnails/v0Pk6OE2vr_5e94d424ee62b6000723bc96_video_thumb.0000014.jpg",
  },
  {
    title: "Do I need to stop any current medications prior to the Rezūm procedure?",
    src: "https://d1fgrjlx888w8f.cloudfront.net/174b744e-38e6-4dee-9194-7a50f672dd98/hls/eDqk0guTwO_5e94d424ee62b6000723bc97_video.m3u8",
    poster:
      "https://d1fgrjlx888w8f.cloudfront.net/174b744e-38e6-4dee-9194-7a50f672dd98/thumbnails/eDqk0guTwO_5e94d424ee62b6000723bc97_video_thumb.0000007.jpg",
  },
  {
    title: "Will I need to take any new medications before or after my Rezūm procedure?",
    src: "https://d1fgrjlx888w8f.cloudfront.net/8751f8f3-727f-49a2-b37b-425a29a49112/hls/PqbKk7GTPy_5e94d424ee62b6000723bc98_video.m3u8",
    poster:
      "https://d1fgrjlx888w8f.cloudfront.net/8751f8f3-727f-49a2-b37b-425a29a49112/thumbnails/PqbKk7GTPy_5e94d424ee62b6000723bc98_video_thumb.0000009.jpg",
  },
  {
    title: "Will the Rezūm procedure effect my sexual function?",
    src: "https://d1fgrjlx888w8f.cloudfront.net/24bc40e8-8bb6-471a-afcb-7df99900e763/hls/68EnDlDtom_5e94d424ee62b6000723bc99_video.m3u8",
    poster:
      "https://d1fgrjlx888w8f.cloudfront.net/24bc40e8-8bb6-471a-afcb-7df99900e763/thumbnails/68EnDlDtom_5e94d424ee62b6000723bc99_video_thumb.0000007.jpg",
  },
  {
    title: "When will I be able to go back to work?",
    src: "https://d1fgrjlx888w8f.cloudfront.net/fd9e0303-8fc6-48a7-9796-4cb9b5229168/hls/h9Qw23lApe_5e94d424ee62b6000723bc9a_video.m3u8",
    poster:
      "https://d1fgrjlx888w8f.cloudfront.net/fd9e0303-8fc6-48a7-9796-4cb9b5229168/thumbnails/h9Qw23lApe_5e94d424ee62b6000723bc9a_video_thumb.0000005.jpg",
  },
  {
    title: "When will I be able to exercise after the Rezūm procedure?",
    src: "https://d1fgrjlx888w8f.cloudfront.net/daf6d92d-8214-4c87-96ca-469b35419274/hls/nSO7O9wxJh_5e94d424ee62b6000723bc9b_video.m3u8",
    poster:
      "https://d1fgrjlx888w8f.cloudfront.net/daf6d92d-8214-4c87-96ca-469b35419274/thumbnails/nSO7O9wxJh_5e94d424ee62b6000723bc9b_video_thumb.0000006.jpg",
  },
];
