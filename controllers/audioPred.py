import os
from os import listdir
from os.path import join
from os.path import isfile
import requests
import sys

import keras
from keras import backend as K
import librosa
import numpy as np
import tensorflow as tf

import logging

from pathlib import Path,PureWindowsPath


class Predict:


    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        model_name = 'Emotion_Voice_Detection_Model.h5'
        self.graph = tf.get_default_graph()
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        path=(os.path.join(BASE_DIR,"controllers/models"))
        #print(path)
        self.loaded_model = keras.models.load_model((os.path.join(path,'Emotion_Voice_Detection_Model.h5')))
        global graph
        graph = tf.get_default_graph()
        self.predictions = []
        

    def file_elaboration(self, filepath):
        """
        This function is used to elaborate the file used for the predictions with librosa.
        :param filepath:
        :return: predictions
        """

        with graph.as_default():
            data, sampling_rate = librosa.load(filepath)
            try:
                mfccs = np.mean(librosa.feature.mfcc(y=data, sr=sampling_rate,
                                                     n_mfcc=40).T, axis=0)
                training_data = np.expand_dims(mfccs, axis=2)
                training_data_expanded = np.expand_dims(training_data, axis=0)
                numpred = self.loaded_model.predict_classes(training_data_expanded)
                
                self.predictions.append(self.classtoemotion(numpred))
                return self.predictions
                

            except ValueError as err:
                return Response(str(err), status=status.HTTP_400_BAD_REQUEST)

    def post(self):
        """
        This method is used to making predictions on audio files
        loaded with FileView.post
        """
        
       
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        path=(os.path.join(BASE_DIR,"public"))
        path1=(os.path.join(path,"files/"))
    
        filepath = (path1+ sys.argv[1])
       
        predictions = self.file_elaboration(filepath)
        K.clear_session() 
        try:
            print (predictions[0])
        except ValueError as err:
            return (str(err))

    @staticmethod
    def classtoemotion(pred):
        """
        This method is used to convert the predictions (int) into human readable strings.
        ::pred:: An int from 0 to 7.
        ::output:: A string label

        Example:
        classtoemotion(0) == neutral
        """

        label_conversion = {'0': 'neutral',
                            '1': 'calm',
                            '2': 'happy',
                            '3': 'sad',
                            '4': 'angry',
                            '5': 'fearful',
                            '6': 'disgust',
                            '7': 'surprised'}

        for key, value in label_conversion.items():
            if int(key) == pred:
                label = value
        return label

p1 = Predict()
p1.post()

