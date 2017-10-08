import numpy as np
import cv2
import pickle
import sys


def play(file):
  playing = True
  video = cv2.VideoCapture(file)
  def on_change(idx):
    video.set(cv2.CAP_PROP_POS_FRAMES, idx)
    ret, img = video.read()
    cv2.imshow('slider', img)
  cv2.namedWindow("slider")
  cv2.createTrackbar('video', 'slider', 0, int(video.get(cv2.CAP_PROP_FRAME_COUNT)), on_change)
  on_change(0)
  while(True):
    ch = cv2.waitKey(30)
    if ch == ord(' '):
      playing = not playing
    if playing:
      cv2.setTrackbarPos('video', 'slider', cv2.getTrackbarPos('video', 'slider')+1)


if __name__ == '__main__':
  play(sys.argv[1])